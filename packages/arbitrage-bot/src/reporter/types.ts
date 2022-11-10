import { ExchangePrice } from '../exchange/types';
import { SwapResult } from '../types';
import { ProfitOpportunity } from '../profit-finder/types';

export type ReporterPluginEvent =
  | { type: 'LIFECYCLE_START' }
  | { type: 'PRICES_FETCHED'; prices: ExchangePrice[] }
  | { type: 'PROFIT_FOUND'; profitOpportunity: ProfitOpportunity }
  | { type: 'SWAPS_DONE'; swapResults: SwapResult[] }
  | { type: 'ARBITRAGE_COMPLETE'; payload: any };
