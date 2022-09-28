import { expect } from 'chai';

import { ExchangePrice, TokenDecimals } from '@stove-labs/arbitrage-bot';
import {
  addSpotPrice,
  findOptimalQuoteTokenAmount,
  orderLowToHigh,
  TradingStrategy,
} from '../src/math';

describe('math.ts', () => {
  const prices = [
    {
      baseTokenBalance: { amount: '12470264030' },
      quoteTokenBalance: { amount: '19328447920594343' },
      exchangeIdentifier: 'exchange1',
    },
    {
      baseTokenBalance: { amount: '100' }, // 0.000100
      quoteTokenBalance: { amount: '400' }, // 0.000000000400
      exchangeIdentifier: 'exchange2',
    },
    {
      baseTokenBalance: { amount: '1000000' }, // 1.000000
      quoteTokenBalance: { amount: '4000000000000' }, // 4.000000000000
      exchangeIdentifier: 'exchange3',
    },
  ] as ExchangePrice[];

  // compare computed values to these
  const spotPrices = [
    '645176', // https://www.calculator.net/big-number-calculator.html?cx=12470.264030&cy=19328.447920594343&cp=30&co=divide * 60000 (decimals)
    '250000000000', // https://www.calculator.net/big-number-calculator.html?cx=0.000100&cy=0.000000000400&cp=30&co=divide
    '250000', // 0.25 at 6 decimals
  ];

  const tokenDecimals = { baseToken: 6, quoteToken: 12 } as TokenDecimals;

  describe('addSpotPrice', () => {
    it('can calculate and add spot price', () => {
      const pricesWithSpotPrice = addSpotPrice(prices, tokenDecimals);
      pricesWithSpotPrice.forEach((price, index) => {
        expect(price.spotPrice).to.equal(spotPrices[index]);
      });
    });
  });

  describe('orderLowToHigh', () => {
    let listOfPrices = [prices[1], prices[0]];
    let ascendingPrices;
    beforeEach(() => {
      ascendingPrices = orderLowToHigh(listOfPrices, tokenDecimals);
    });

    it('can order spot prices in ascending order', () => {
      expect(
        Number(ascendingPrices[ascendingPrices.length - 1].spotPrice)
      ).to.be.gt(Number(ascendingPrices[0].spotPrice));
    });

    it('can shift prices in an unordered list', () => {
      expect(ascendingPrices[0]).to.equal(listOfPrices[1]);
      expect(ascendingPrices[0]).to.not.equal(listOfPrices[0]);

      expect(ascendingPrices[1]).to.equal(listOfPrices[0]);
      expect(ascendingPrices[1]).to.not.equal(listOfPrices[1]);
    });
  });

  describe('findOptimalQuoteTokenAmount', () => {
    it('can calculate optimal quote token amount', () => {
      const tradingStrategy: TradingStrategy = {
        swapBuy: {
          reserveIn: '1247026403',
          reserveOut: '19328447920594343',
          tokenIn: { ticker: 'XTZ' },
          tokenOut: { ticker: 'uUSD' },
        },
        swapSell: {
          reserveIn: ' 7594296904728968',
          reserveOut: '50125177994',
          tokenIn: { ticker: 'uUSD' },
          tokenOut: { ticker: 'XTZ' },
        },
      };
      const optimalAmount = findOptimalQuoteTokenAmount(
        tradingStrategy,
        tokenDecimals
      );

      expect(optimalAmount).to.equal('174882610223218');
    });
  });
});
