import {
  ExchangePrice,
  ProfitOpportunity,
  TokenDecimals,
  TokenPlugin,
} from '@stove-labs/arbitrage-bot';
import { ProfitFinderLitePlugin } from '../src/profitFinderLitePlugin';
import { expect } from 'chai';

describe('profitFinderLite.ts', () => {
  const prices = [
    {
      baseToken: { ticker: 'XTZ' },
      baseTokenBalance: { amount: '12470264030' },
      quoteToken: { ticker: 'USD' },
      quoteTokenBalance: { amount: '19328447920594343' },
      exchangeIdentifier: 'QUIPUSWAP',
      fee: 3,
    },
    {
      baseToken: { ticker: 'XTZ' },
      baseTokenBalance: { amount: '50125177994' },
      quoteToken: { ticker: 'USD' },
      quoteTokenBalance: { amount: '75942969047289680' },
      exchangeIdentifier: 'SPICYSWAP',
      fee: 3,
    },
  ] as ExchangePrice[];

  // mocking the token registry
  const tokenRegistry = {
    getTokenDecimals: () => {
      return { baseToken: 6, quoteToken: 12 } as TokenDecimals;
    },
  } as unknown as TokenPlugin;

  describe('expected profit is not split for slippage, profitSplitForSlippage = 0', () => {
    const expectedBuySwap = {
      tokenIn: { ticker: 'XTZ' },
      tokenOut: { ticker: 'USD' },
      amount: '174831146443413',
      type: 'BUY',
      limit: '113823456',
      limitWithoutSlippage: '113823456',
    };
    const expectedSellSwap = {
      tokenIn: { ticker: 'USD' },
      tokenOut: { ticker: 'XTZ' },
      amount: '174831146443413',
      type: 'SELL',
      limit: '114785400',
      limitWithoutSlippage: '114785400',
    };
    const expectedProfit = '961944';

    let profitOpportunity: ProfitOpportunity;
    beforeEach(() => {
      const plugin = new ProfitFinderLitePlugin({
        tokenRegistry,
        profitSplitForSlippage: 0,
      });

      profitOpportunity = plugin.findProfits(prices);
    });
    it('can calculate BUY swap', () => {
      const buySwap = profitOpportunity.swaps.find(
        (swap) => swap.type === 'BUY'
      );

      expect(buySwap).to.deep.equal(expectedBuySwap);
    });
    it('can calculate SELL swap', () => {
      const sellSwap = profitOpportunity.swaps.find(
        (swap) => swap.type === 'SELL'
      );

      expect(sellSwap).to.deep.equal(expectedSellSwap);
    });
    it('can calculate profit', () => {
      const profit = profitOpportunity.profit;
      expect(profit).to.deep.equal({ baseTokenAmount: expectedProfit });
    });
  });

  describe('expected profit is equally split for slippage, profitSplitForSlippage = 2', () => {
    const expectedBuySwap = {
      tokenIn: { ticker: 'XTZ' },
      tokenOut: { ticker: 'USD' },
      amount: '174831146443413',
      type: 'BUY',
      limit: '114304428',
      limitWithoutSlippage: '113823456',
    };
    const expectedSellSwap = {
      tokenIn: { ticker: 'USD' },
      tokenOut: { ticker: 'XTZ' },
      amount: '174831146443413',
      type: 'SELL',
      limit: '114304428',
      limitWithoutSlippage: '114785400',
    };
    const expectedProfit = '961944';

    let profitOpportunity: ProfitOpportunity;
    beforeEach(() => {
      const plugin = new ProfitFinderLitePlugin({
        tokenRegistry,
        profitSplitForSlippage: 2,
      });

      profitOpportunity = plugin.findProfits(prices);
    });
    it('can calculate BUY swap', () => {
      const buySwap = profitOpportunity.swaps.find(
        (swap) => swap.type === 'BUY'
      );

      expect(buySwap).to.deep.equal(expectedBuySwap);
    });
    it('can calculate SELL swap', () => {
      const sellSwap = profitOpportunity.swaps.find(
        (swap) => swap.type === 'SELL'
      );

      expect(sellSwap).to.deep.equal(expectedSellSwap);
    });
    it('can calculate profit', () => {
      const profit = profitOpportunity.profit;
      expect(profit).to.deep.equal({ baseTokenAmount: expectedProfit });
    });
  });
});
