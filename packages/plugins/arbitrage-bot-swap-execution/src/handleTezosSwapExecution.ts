import {
  Swap,
  SwapResult,
  TezosKey,
  Operation,
} from '@stove-labs/arbitrage-bot';
import {
  TezosToolkit,
  withKind,
  TransferParams,
  OpKind,
} from '@taquito/taquito';
import {
  OperationContentsAndResultTransaction,
  OperationResultTransaction,
} from '@taquito/rpc';
import * as _ from 'lodash';
import { BigNumber } from 'bignumber.js';
import { errorXtzProfitLowerThanTotalOperationCost } from './errors';

// for DEBUG output
const argv = require('yargs/yargs')(process.argv.slice(2))
  .count('verbose')
  .alias('v', 'verbose').argv;
const VERBOSE_LEVEL = argv.verbose;
const DEBUG = VERBOSE_LEVEL >= 2 ? console.log : () => {};

export const handleTezosSwapExecution = async (
  swaps: Swap[],
  batchParameters: withKind<TransferParams, OpKind.TRANSACTION>[],
  ecosystemKey: TezosKey,
  exchangeAddresses: string[]
): Promise<SwapResult> => {
  // initialize taquito signer with keychain
  const tezos = new TezosToolkit(ecosystemKey.rpc);
  tezos.setSignerProvider(ecosystemKey.signer);

  const estimates = await tezos.estimate.batch(batchParameters);
  debugLogTezosEstimates(estimates);
  const totalEstOpCost = estimates.reduce(
    (sum, current) => sum + current.suggestedFeeMutez,
    0
  );

  debugLogEstimatedOpCost(totalEstOpCost);

  let multiplier = ecosystemKey.multiplier || 1;

  batchParameters[0].fee = new BigNumber(totalEstOpCost * multiplier)
    .integerValue()
    .toNumber();

  const totalInflatedOpCost = batchParameters.reduce(
    (sum, current) => (sum + current.fee ? current.fee : 0),
    0
  );

  debugLogInflatedOpCost(totalInflatedOpCost, batchParameters);

  if (!isXTZProfitHigherThanTotalOperationCost(swaps, totalInflatedOpCost))
    return errorXtzProfitLowerThanTotalOperationCost;

  const operation = await tezos.contract.batch(batchParameters).send();
  await operation.confirmation(1);

  debugLogOpResults(operation);

  let profitFromOperation: string | undefined;
  // TODO: implement FA2 profit calculation and remove try catch block
  try {
  profitFromOperation = getProfitFromOperation(
    operation.results as OperationContentsAndResultTransaction[],
    exchangeAddresses[0], // swap 1 exchange address
    exchangeAddresses[1] // swap 2 exchange address
  );
  } catch (e) {
    profitFromOperation = undefined;
  }

  const operationDetails: Operation = {
    ecosystem: 'TEZOS',
    exchanges: swaps.map((swap) => swap.identifier),
    baseToken: swaps[0].tokenIn,
    quoteToken: swaps[1].tokenOut,
    operationHash: operation.hash,
    profit: {
      amount: profitFromOperation,
      decimals: swaps[0].tokenInDecimals.toFixed(),
    },
    // TODO: take total costs from applied BatchOperation
    totalOperationCost: totalInflatedOpCost.toFixed(),
  };

  return {
    result: {
      type: 'OK',
      operation: operationDetails,
    },
  };
};

export const getProfitFromOperation = (
  operationResults: OperationContentsAndResultTransaction[],
  swap1ExchangeAddress: string,
  swap2ExchangeAddress: string
): string => {
  const botAddress = operationResults[0].source;
  // if first tx in batch has no XTZ attached, baseToken = FA1.2 or FA2
  if (operationResults[0].amount === '0') {
    // extracting token values only works with FA1.2
    const tokenAmountSent = getTokenSent(operationResults);
    const tokenAddress = getTokenAddress(operationResults);
    const tokenAmountReceived = getTokenReceived(
      operationResults,
      botAddress,
      swap2ExchangeAddress,
      tokenAddress
    );
    return new BigNumber(tokenAmountReceived).minus(tokenAmountSent).toFixed();
  }
  // first tx has XTZ attached, baseToken = XTZ
  else if (Number(operationResults[0].amount) !== 0) {
    const xtzSent = getXtzSent(
      operationResults,
      botAddress,
      swap1ExchangeAddress
    );
    const xtzReceived = getXTZReceived(
      operationResults,
      botAddress,
      swap2ExchangeAddress
    );
    return new BigNumber(xtzReceived).minus(xtzSent).toFixed();
  } else throw new Error(`Can't retrieve profit from operation`);
};

const isXTZProfitHigherThanTotalOperationCost = (
  swaps: Swap[],
  totalOperationCostInXTZ: number
): boolean => {
  // if base token is not XTZ, we can't compare
  if (swaps[0].tokenIn.ticker !== 'XTZ') return true;
  // buy swap
  const inputAmount = swaps[0].limit;
  // sell swap
  const outputAmount = swaps[1].limit;

  const profit = new BigNumber(outputAmount).minus(inputAmount);

  return profit.isGreaterThanOrEqualTo(totalOperationCostInXTZ) ? true : false;
};

const getTokenAddress = (
  operationResults: OperationContentsAndResultTransaction[]
) => {
  const operation = operationResults.find(
    (op) =>
      op.parameters.entrypoint === 'approve' ||
      op.parameters.entrypoint === 'update_operators'
  );
  return operation.destination;
};

// only works with FA1.2
const getTokenSent = (
  operationResults: OperationContentsAndResultTransaction[]
) => {
  const operation = operationResults.find(
    (op) => op.parameters.entrypoint === 'approve'
  );
  // TODO find proper type for this FA1.2 specific approve operation
  return (operation as any).parameters.value.args[1].int;
};

// only works with FA1.2
const getTokenReceived = (
  operationResults: OperationContentsAndResultTransaction[],
  botAddress: string,
  exchangeAddress: string,
  tokenAddress: string
) => {
  // find operation that interacts with the exchange of the 2nd swap
  const operation = operationResults.find((op) => {
    return op.source === botAddress && op.destination === exchangeAddress;
  });
  // find internal operation where the exchange interacts with the token contract
  const tokenTransferOperation =
    operation.metadata.internal_operation_results.find((internalOperation) => {
      return (
        internalOperation.source === exchangeAddress &&
        internalOperation.destination === tokenAddress
      );
    });
  // TODO find proper type for this FA1.2 specific transfer operation
  return (tokenTransferOperation as any).parameters.value.args[1].args[1].int;
};

const getXtzSent = (
  operationResults: OperationContentsAndResultTransaction[],
  botAddress: string,
  receivingExchangeAddress: string
) => {
  // find operation where bot is XTZ sender and exchange recipient
  const operation = operationResults.find((op) => {
    return (
      op.destination === receivingExchangeAddress && op.source == botAddress
    );
  });
  return operation.amount;
};

const getXTZReceived = (
  operationResults: OperationContentsAndResultTransaction[],
  botAddress: string,
  exchangeAddress: string
) => {
  // find operation where bot calls the exchange to perform token to xtz swap
  const operation = operationResults.find((op) => {
    return op.destination === exchangeAddress && op.source === botAddress;
  });

  // search internal_operation_results where bot is recipient and exchange sender
  const exchangeToAccount = operation.metadata.internal_operation_results.find(
    (op) => {
      return op.source === exchangeAddress && op.destination === botAddress;
    }
  );

  // extract XTZ amount balance update
  const xtzSent = (
    exchangeToAccount.result as OperationResultTransaction
  ).balance_updates.find((balanceUpdate) => {
    return balanceUpdate.contract === botAddress;
  }).change;

  return xtzSent;
};

const debugLogOpResults = (operation) => {
  DEBUG('logging operation');
  DEBUG('operation hash', operation.hash);
  DEBUG('errors', operation.errors);
  DEBUG('results\n', operation.results);
};

const debugLogInflatedOpCost = (
  totalInflatedOpCost: number,
  batchParameters: withKind<TransferParams, OpKind.TRANSACTION>[]
) => {
  DEBUG('inflated fees', totalInflatedOpCost);
  DEBUG('inflated fees formatted', totalInflatedOpCost / 10 ** 6);
  DEBUG('batch parameters with multiplier', batchParameters);
};

const debugLogEstimatedOpCost = (totalEstOpCost: number) => {
  DEBUG('suggested operation cost:', totalEstOpCost);
  DEBUG('suggested operation cost formatted:', totalEstOpCost / 10 ** 6);
};

const debugLogTezosEstimates = (estimates) => {
  estimates.forEach((est) => {
    DEBUG(`\n burnFeeMutez : ${est.burnFeeMutez}, 
            gasLimit : ${est.gasLimit}, 
            minimalFeeMutez : ${est.minimalFeeMutez}, 
            storageLimit : ${est.storageLimit}, 
            suggestedFeeMutez : ${est.suggestedFeeMutez}, 
            totalCost : ${est.totalCost}, 
            usingBaseFeeMutez : ${est.usingBaseFeeMutez}`);
  });
};
