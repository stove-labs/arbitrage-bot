import { Swap } from '../blockchain/types';
import { ExchangePlugin } from '../exchange/interface';
import { SwapResult } from './types';

export interface SwapExecutionManager {
  getExchangePluginBySwap(swap: Swap): ExchangePlugin;
  executeSwaps(swaps: Swap[]): Promise<SwapResult[]>;
}
