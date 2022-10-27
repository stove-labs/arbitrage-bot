import { ExchangePlugin, Swap } from '../types';
import { SwapResult } from './types';

export interface SwapExecutionManager {
  getExchangePluginBySwap(swap: Swap): ExchangePlugin;
  executeSwaps(swaps: Swap[]): Promise<SwapResult[]>;
}
