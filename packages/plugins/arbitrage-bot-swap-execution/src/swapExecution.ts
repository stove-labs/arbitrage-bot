import {
  ExchangePlugin,
  Swap,
  SwapResult,
  SwapExecutionManager,
} from '@stove-labs/arbitrage-bot';
import {
  TezosToolkit,
  withKind,
  TransferParams,
  OpKind,
  ParamsWithKind,
} from '@taquito/taquito';
import * as _ from 'lodash';
import { BigNumber } from 'bignumber.js';
import { xtzProfitLowerThanTotalOperationCost } from './errors';

// for DEBUG output
const argv = require('yargs/yargs')(process.argv.slice(2))
  .count('verbose')
  .alias('v', 'verbose').argv;
const VERBOSE_LEVEL = argv.verbose;
const DEBUG = VERBOSE_LEVEL >= 2 ? console.log : () => {};

export class BatchSwapExecutionManager implements SwapExecutionManager {
  constructor(public exchanges: ExchangePlugin[], public keychains: any) {}

  getExchangePluginBySwap(swap: Swap): ExchangePlugin {
    return this.exchanges.find(
      (exchange) =>
        swap.identifier === exchange.identifier &&
        swap.ecosystemIdentifier === exchange.ecosystemIdentifier
    );
  }

  // iterate through swaps and forge a batch operation for each ecosystem identifier
  public async executeSwaps(swaps: Swap[]): Promise<SwapResult[]> {
    const groupedSwaps = _.groupBy(swaps, 'ecosystemIdentifier');
    let swapResult: SwapResult[] = [];
    // go through all the identifiers
    const swapsOperations = Object.keys(groupedSwaps).map(
      // find keychain by ecosystem identifier and use it to authorize the swap
      async (ecosystemIdentifier) => {
        const swaps = groupedSwaps[ecosystemIdentifier];
        // in case of Tezos, pass information from the config.keychain to a taquito signer
        if (ecosystemIdentifier === 'TEZOS') {
          let batchParameters: ParamsWithKind[] = [];

          // forge an internal operation for the inside of the batch using the ExchangePlugin
          for await (const operationParameters of swaps.map((swap) =>
            this.getExchangePluginBySwap(swap).forgeOperation(
              swap,
              this.keychains.TEZOS.address
            )
          )) {
            batchParameters = [...batchParameters, ...operationParameters];
          }

          // initialize taquito signer with keychain
          const tezosRpc = this.getExchangePluginBySwap(swaps[0]).config.rpc;
          const tezos = new TezosToolkit(tezosRpc);
          tezos.setSignerProvider(this.keychains.TEZOS.signer);

          const estimates = await tezos.estimate.batch(batchParameters);
          estimates.forEach((est) => {
            console.log(`\n burnFeeMutez : ${est.burnFeeMutez}, 
            gasLimit : ${est.gasLimit}, 
            minimalFeeMutez : ${est.minimalFeeMutez}, 
            storageLimit : ${est.storageLimit}, 
            suggestedFeeMutez : ${est.suggestedFeeMutez}, 
            totalCost : ${est.totalCost}, 
            usingBaseFeeMutez : ${est.usingBaseFeeMutez}`);
          });
          const totalEstimatedOperationCost = estimates.reduce(
            (sum, current) => sum + current.suggestedFeeMutez,
            0
          );

          DEBUG('suggested operation cost:', totalEstimatedOperationCost);

          DEBUG(
            'suggested operation cost formatted:',
            totalEstimatedOperationCost / 10 ** 6
          );

          let multiplier = 1.3;
          let firstTxMultiplier = 130;
          console.log(batchParameters[0]);
          (
            batchParameters[0] as withKind<TransferParams, OpKind.TRANSACTION>
          ).fee = new BigNumber(totalEstimatedOperationCost * multiplier)
            .integerValue()
            .toNumber();
          // batchParameters = batchParameters.map(
          //   (
          //     batchParameter: withKind<TransferParams, OpKind.TRANSACTION>,
          //     index
          //   ) => {
          //     const feeMultiplier =
          //       index === 0 ? firstTxMultiplier : multiplier;
          //     batchParameter.fee = new BigNumber(
          //       estimates[index].suggestedFeeMutez * feeMultiplier
          //     )
          //       .integerValue()
          //       .toNumber();
          //     batchParameter.gasLimit = new BigNumber(
          //       estimates[index].gasLimit * multiplier
          //     )
          //       .integerValue()
          //       .toNumber();

          //     return batchParameter;
          //   }
          // );

          const totalInflatedOperationCost = batchParameters.reduce(
            (sum, current: withKind<TransferParams, OpKind.TRANSACTION>) =>
              sum + current.fee,
            0
          );
          console.log('inflated fees', totalInflatedOperationCost);
          console.log(
            'inflated fees formatted',
            totalInflatedOperationCost / 10 ** 6
          );
          console.log('batch parameters with multiplier', batchParameters);

          if (
            !this.isXTZProfitHigherThanTotalOperationCost(
              swaps,
              totalInflatedOperationCost
            )
          )
            return [xtzProfitLowerThanTotalOperationCost];

          const operation = await tezos.contract.batch(batchParameters).send();
          console.log(operation.hash);
          console.log(operation.errors);
          console.log(operation.results);

          return [
            {
              result: {
                type: 'OK',
                operation: estimates,
              },
            },
            ...swapResult,
          ];
        }

      }
    );

    return swapResult;
  }

  isXTZProfitHigherThanTotalOperationCost(
    swaps: Swap[],
    totalOperationCostInXTZ: number
  ): boolean {
    // if base token is not XTZ, we can't compare
    if (swaps[0].tokenIn.ticker !== 'XTZ') return true;
    // buy swap
    const inputAmount = swaps[0].amount;
    // sell swap
    const outputAmount = swaps[1].limit;

    const profit = new BigNumber(outputAmount).minus(inputAmount);

    return profit.isGreaterThanOrEqualTo(totalOperationCostInXTZ)
      ? true
      : false;
  }
}
