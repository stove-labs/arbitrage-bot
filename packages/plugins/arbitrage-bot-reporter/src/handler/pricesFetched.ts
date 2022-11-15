import { ExchangePrice } from '@stove-labs/arbitrage-bot';
import { STATUS, warning } from '../consoleReporterPlugin';

export const handlePricesFetched = (prices: ExchangePrice[]) => {
  if (!STATUS) return ;
  if (!prices) return 'Fetching prices...';

  return `Prices fetched:       ${warning(new Date().toLocaleTimeString())}`;
};
