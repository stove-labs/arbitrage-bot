import {
  ExchangePrice,
  ProfitOpportunity,
  SwapType,
} from '@stove-labs/arbitrage-bot';
import { expect } from 'chai';
import { ConsoleReporterPlugin } from '../src/consoleReporterPlugin';

describe('consoleReporterPlugin', () => {
  describe('no profit found', () => {
    let reporter: ConsoleReporterPlugin;
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

    const profitOpportunity: ProfitOpportunity = {
      swaps: [
        {
          amount: '0',
          limit: '1',
          limitWithoutSlippage: '1',
          tokenIn: { ticker: 'XTZ' },
          tokenInDecimals: 6,
          tokenOutDecimals: 18,
          tokenOut: { ticker: 'kUSD' },
          type: SwapType.BUY,
          identifier: 'VORTEX',
          ecosystemIdentifier: 'TEZOS',
        },
        {
          amount: '0',
          limit: '0',
          limitWithoutSlippage: '0',
          tokenIn: { ticker: 'kUSD' },
          tokenInDecimals: 18,
          tokenOutDecimals: 6,
          tokenOut: { ticker: 'XTZ' },
          type: SwapType.SELL,
          identifier: 'QUIPUSWAP',
          ecosystemIdentifier: 'TEZOS',
        },
      ],
      profit: { baseTokenAmount: '-1' },
    };

    beforeEach(() => {
      reporter = new ConsoleReporterPlugin();
    });
    it('can report on one full lifecycle where no profit was found', async () => {
      reporter.report({ type: 'LIFECYCLE_START' });

      await new Promise(f => setTimeout(f, 3000));

      reporter.report({ type: 'PRICES_FETCHED', prices });

      await new Promise(f => setTimeout(f, 3000));

      reporter.report({ type: 'PROFIT_FOUND', profitOpportunity }); 
    });
  });
});
