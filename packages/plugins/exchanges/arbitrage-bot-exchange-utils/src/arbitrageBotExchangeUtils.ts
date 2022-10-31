import { Token, ExchangeRegistry } from '@stove-labs/arbitrage-bot';
import _ from 'lodash';

/**
 * Returns exchange address for given token ticker pair.
 * Limited to trading pairs.
 */
export const getExchangeAddressFromRegistry = (
  token1: Token,
  token2: Token,
  instances: ExchangeRegistry
): string | undefined => {
  {
    const exchangeInstance = instances.find((instance) => {
      return (
        (instance.ticker1 === token1.ticker &&
          instance.ticker2 === token2.ticker) ||
        (instance.ticker1 === token2.ticker &&
          instance.ticker2 === token1.ticker)
      );
    });
    return exchangeInstance ? exchangeInstance.address : undefined;
  }
};

/**
 * This method returns all trading pairs that are being traded
 * on two or more exchanges.
 * Ignore those trading pairs that are not being traded on at least 2 exchanges,
 * because no arbitrage would be possible.
 */
export const getDuplicateTradingPairsFromAllExchanges = (
  exchangeRegistry: ExchangeRegistry[]
) => {
  // extract all tickers [[ticker1, ticker2], [ticker1, ticker2], ...]
  const pairs = exchangeRegistry.flatMap((exchanges) =>
    exchanges.map((pair) => [pair.ticker1, pair.ticker2])
  );
  // order alphabetically eg. => [ticker2, ticker1]
  const pairsSorted = pairs.map((pair) =>
    pair.sort((a, b) => a.localeCompare(b))
  );
  // convert into an object and add an id
  const sortedPairsObject = pairsSorted.map((pair) => {
    const ticker1 = pair[0];
    const ticker2 = pair[1];
    const id = `${ticker1}${ticker2}`;

    return {
      ticker1,
      ticker2,
      id,
    };
  });

  const tickers = _.flow([
    (values) => _.groupBy(values, 'id'), // group elements by id
    // take only duplicates or more, thus remove uniques
    (grouped) => _.filter(grouped, (o) => o.length > 1),
    _.flatten, // flatten the results to a single array
    (b) => _.uniqBy(b, 'id'), // extract unique
  ])(sortedPairsObject);

  // remove id
  tickers.forEach((tickersExchange) => delete tickersExchange.id);

  return tickers;
};
