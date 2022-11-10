import { ExchangePrice } from '@stove-labs/arbitrage-bot';
import { handlePricesFetched } from '../../src/handler/pricesFetched';

describe('prices fetches', () => {
  describe('no profit', () => {
    const prices: ExchangePrice[] = [
      {
        baseToken: {
          ticker: 'XTZ',
          address: 'native',
          decimals: 6,
          ecosystemIdentifier: 'TEZOS',
        },
        baseTokenBalance: { amount: '14940270938' },
        quoteToken: {
          ticker: 'kUSD',
          address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
          decimals: 18,
          ecosystemIdentifier: 'TEZOS',
        },
        quoteTokenBalance: { amount: '16013485687542328761467' },
        identifier: 'VORTEX',
        ecosystemIdentifier: 'TEZOS',
        fee: 28,
        spotPrice: '932980',
      },
      {
        baseToken: {
          ticker: 'XTZ',
          address: 'native',
          decimals: 6,
          ecosystemIdentifier: 'TEZOS',
        },
        baseTokenBalance: { amount: '149603497766' },
        quoteToken: {
          ticker: 'kUSD',
          address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
          decimals: 18,
          ecosystemIdentifier: 'TEZOS',
        },
        quoteTokenBalance: { amount: '160299740742899133256578' },
        identifier: 'QUIPUSWAP',
        ecosystemIdentifier: 'TEZOS',
        fee: 30,
        spotPrice: '933273',
      },
    ];

    it('can report for prices fetched', () => {
        handlePricesFetched(prices)
    });
  });
});
