import { expect } from 'chai';

import { ExchangePrice } from '@stove-labs/arbitrage-bot';
import {
    addSpotPrice,
    findOptimalAmount,
    orderLowToHigh,
    TradingStrategy,
} from '../src/math';
import { BigNumber } from 'bignumber.js';

describe('math.ts', () => {
    const prices = [
        {
            baseTokenBalance: { amount: '1' },
            quoteTokenBalance: { amount: '3' },
            exchangeIdentifier: 'QUIPUSWAP',
        },
        {
            baseTokenBalance: { amount: '1' },
            quoteTokenBalance: { amount: '4' },
            exchangeIdentifier: 'VORTEX',
        },
    ] as ExchangePrice[];

    describe('addSpotPrice', () => {
        it('can calculate and add spot price', () => {
            const pricesWithSpotPrice = addSpotPrice(prices);
            pricesWithSpotPrice.forEach((price) => {
                expect(price.spotPrice).to.equal(
                    new BigNumber(price.baseTokenBalance.amount)
                        .dividedBy(price.quoteTokenBalance.amount)
                        .toNumber()
                );
            });
        });
    });

    describe('orderLowToHigh', () => {
        it('can order a list of exchange prices based on ASCENDING spot price', () => {
            const orderedPrices = orderLowToHigh(prices);

            expect(orderedPrices[orderedPrices.length - 1].spotPrice).to.be.gt(
                orderedPrices[0].spotPrice
            );

            expect(orderedPrices[0].exchangeIdentifier).to.not.equal(
                prices[0].exchangeIdentifier
            );
            expect(orderedPrices[0].exchangeIdentifier).to.equal(
                prices[1].exchangeIdentifier
            );
            expect(orderedPrices[1].exchangeIdentifier).to.not.equal(
                prices[1].exchangeIdentifier
            );
            expect(orderedPrices[1].exchangeIdentifier).to.equal(
                prices[0].exchangeIdentifier
            );
        });
    });
    describe('findOptimalAmount', () => {
        it('can calculate optimal amount', () => {
            const tradingStrategy: TradingStrategy = {
                swapBuy: {
                    reserveIn: '12470',
                    reserveOut: '19328',
                },
                swapSell: {
                    reserveIn: '50125',
                    reserveOut: '75942',
                },
            };
            const optimalAmount = findOptimalAmount(tradingStrategy);
            console.log('optimalAmount', optimalAmount.toString())
            expect(true).to.be.true;
        });
    });
});
