import {
  ExchangePlugin,
  Swap,
  SwapResult,
  SwapExecutionManager,
} from '@stove-labs/arbitrage-bot';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit, OperationBatch, ParamsWithKind } from '@taquito/taquito';
import * as _ from 'lodash';

export class BatchSwapExecutionManager implements SwapExecutionManager {
  constructor(public exchanges: ExchangePlugin[], public keychains: any) {}

  getExchangePluginBySwap(swap: Swap): ExchangePlugin {
    return this.exchanges.find(
      (exchange) =>
        swap.identifier === exchange.identifier &&
        swap.ecosystemIdentifier === exchange.ecosystemIdentifier
    );
  }

  // this logic can live in a standalone plugin, e.g. SwapExecutionBatchPlugin or SwapExecutionContractPlugin
  public async executeSwaps(swaps: Swap[]): Promise<SwapResult[]> {
    const groupedSwaps = _.groupBy(swaps, 'ecosystemIdentifier');
    let swapResult: SwapResult[] = [];
    // go through all the identifiers
    const result = Object.keys(groupedSwaps).map(
      async (ecosystemIdentifier) => {
        // find keychain by ecosystem identifier and use it to authorize the swap
        // in case of tezos, pass information from the keychain to a taquito signer....
        const swaps = groupedSwaps[ecosystemIdentifier];

        if (ecosystemIdentifier === 'TEZOS') {
          let batchParameters: ParamsWithKind[] = [];

          for await (const operationParameters of swaps.map((swap) =>
            this.getExchangePluginBySwap(swap).forgeOperation(
              swap,
              this.keychains.TEZOS.address
            )
          )) {
            batchParameters = [...batchParameters, ...operationParameters];
          }

          const tezos = new TezosToolkit(
            this.getExchangePluginBySwap(swaps[0]).config.rpc
          );
          tezos.setSignerProvider(this.keychains.TEZOS.signer);
          console.log(batchParameters);
          const operation = await tezos.contract.batch(batchParameters).send();
          console.log(operation.hash);
          console.log(operation.errors);
          console.log(operation.results);
          swapResult = [
            {
              result: {
                type: 'OK',
                operation,
              },
            },
            ...swapResult,
          ];
        }

        //const operation = await batch.send();

        // iterate through swaps and forge a batch operation for each ecosystem identifier
        // forge an internal operation for the inside of the batch using an ExchangePlugin
        // retrieved using this.getExchangePluginBySwap(swap).forgeOperation(swap)
      }
    );

    return swapResult;
  }
}
