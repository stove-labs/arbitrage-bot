import { ExchangePrice } from '../exchange/types';
import { ProfitOpportunity } from '../profit-finder/types';
import { SwapResult } from '../swap-execution/types';
import { Report } from '../accountant/types';

export type ReporterPluginEvent =
  | { type: 'LIFECYCLE_START' }
  | { type: 'LIFECYCLE_END' }
  | { type: 'PRICES_FETCHED'; prices?: ExchangePrice[] }
  | { type: 'PROFIT_FOUND'; profitOpportunity?: ProfitOpportunity }
  | { type: 'SWAPS_DONE'; swapResults?: SwapResult[] }
  | { type: 'ARBITRAGE_COMPLETE'; report?: Report };
