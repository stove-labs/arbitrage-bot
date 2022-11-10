import { Swap, SwapResult, TezosKey } from '@stove-labs/arbitrage-bot';
import {
  TezosToolkit,
  withKind,
  TransferParams,
  OpKind,
} from '@taquito/taquito';
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
  ecosystemKey: TezosKey
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
  debugLogOpResults(operation);

  return {
    result: {
      type: 'OK',
      operation: operation,
    },
  };
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

const debugLogOpResults = (operation) => {
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
