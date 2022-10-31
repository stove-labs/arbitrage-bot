import { ExchangePrice } from '@stove-labs/arbitrage-bot';
import { STATUS, warning } from '../consoleReporterPlugin';

export const handlePricesFetched = (prices: ExchangePrice[]) => {
  STATUS('\nPrices fetched', warning(new Date().toLocaleTimeString()));
};
