import {
  ExchangePlugin,
  Swap,
  SwapResult,
  SwapExecutionManager,
  EcosystemKey,
  EcosystemIdentifier,
} from '@stove-labs/arbitrage-bot';
import { handleTezosSwapExecution } from './handleTezosSwapExecution';

import { withKind, TransferParams, OpKind } from '@taquito/taquito';
import * as _ from 'lodash';

export class BatchSwapExecutionManager implements SwapExecutionManager {
  constructor(
    public exchanges: ExchangePlugin[],
    public keychains: Record<EcosystemIdentifier, EcosystemKey>[]
  ) {}

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
    let swapResult = Object.keys(groupedSwaps)
      // go through all the identifiers
      .map(
        // find keychain by ecosystem identifier and use it to authorize the swap
        async (ecosystemIdentifier) => {
          const swapResults: SwapResult[] = [];
          const swaps = groupedSwaps[ecosystemIdentifier];
          // in case of Tezos, pass information from the config.keychain to a taquito signer
          if (ecosystemIdentifier === 'TEZOS') {
            // TODO: retrieve EcosystemKey from Record<EcosystemIdentifier, EcosystemKey> where EcosystemIdentifier === TEZOS
            const tezosKey = this.keychains[0].TEZOS;
            const botAddress = tezosKey.address;

            let batchParameters: withKind<
              TransferParams,
              OpKind.TRANSACTION
            >[] = [];

            // forge an internal operation for the inside of the batch using the ExchangePlugin
            for await (const operationParameters of swaps.map((swap) =>
              this.getExchangePluginBySwap(swap).forgeOperation(
                swap,
                botAddress
              )
            )) {
              batchParameters = [...batchParameters, ...operationParameters];
            }

            const exchangeAddresses = swaps.map((swap) =>
              this.getExchangePluginBySwap(swap).getExchangeAddress(
                swaps[0].tokenIn, // baseToken
                swaps[0].tokenOut // quoteToken
              )
            );

            try {
              const swapResultTezos = await handleTezosSwapExecution(
                swaps,
                batchParameters,
                tezosKey,
                exchangeAddresses
              );
              return swapResultTezos;
            } catch (error) {
              return {
                result: {
                  type: 'ERROR',
                  data: error.errors,
                },
              } as SwapResult;
            }
          }
        }
      );
    return Promise.all(swapResult);
  }
}
