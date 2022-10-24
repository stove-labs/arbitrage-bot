import { ExchangePrice } from '@stove-labs/arbitrage-bot';
import { getAmountInGivenOut, getAmountOutGivenIn } from './pools/xyk/xykPool';
import { BigNumber } from 'bignumber.js';
import _ from 'lodash';

// for DEBUG output
const argv = require('yargs/yargs')(process.argv.slice(2))
  .count('verbose')
  .alias('v', 'verbose').argv;
const VERBOSE_LEVEL = argv.verbose;
const DEBUG = VERBOSE_LEVEL >= 2 ? console.log : () => {};

/**
 * Spot price = baseToken/quoteToken
 * eg. XTZ/USD = 0.65 XTZ/USD
 * pay 0.65 XTZ
 * receive 1 USD
 */
export const addSpotPrice = (prices: ExchangePrice[]): ExchangePrice[] => {
  prices.map((exchangePrice) => {
    const baseTokenReserve = new BigNumber(
      exchangePrice.baseTokenBalance.amount
    ).dividedBy(10 ** exchangePrice.baseTokenDecimals);

    const quoteTokenReserve = new BigNumber(
      exchangePrice.quoteTokenBalance.amount
    ).dividedBy(10 ** exchangePrice.quoteTokenDecimals);

    exchangePrice.spotPrice = baseTokenReserve
      .dividedBy(quoteTokenReserve)
      .multipliedBy(10 ** exchangePrice.baseTokenDecimals)
      .toFixed(0, 1);

    return exchangePrice;
  });
  return prices;
};

/**
 * Orders exchange prices from low to high spot price based on baseToken and quoteToken definition.
 *
 * Example:
 * baseToken balance = 1 XTZ
 * quoteToken balance = 2 USD
 * Spot price: 1USD = 0.5 XTZ
 */
export const orderLowToHigh = (prices: ExchangePrice[]): ExchangePrice[] => {
  //const tokenInfo = getTokenInfo(prices);
  prices = addSpotPrice(prices);

  return _.orderBy(
    prices,
    [
      // need to transform string to number so it can be ordered
      (exchangePrice) => {
        return new BigNumber(exchangePrice.spotPrice).toNumber();
      },
    ],
    'asc'
  );
};

/**
 * Finds optimal amount x between buy and sell swap.
 * This is done by solving a univariate quadratic function f(x).
 *
 * a*x^2+b*x+c=0
 * x1 = (- b + sqrt(b² - 4*a*c))/(2*a)
 * x2 = (- b - sqrt(b² - 4*a*c))/(2*a)
 */
export const findOptimalQuoteTokenAmount = (prices: ExchangePrice[]) => {
  DEBUG('Finding optimal quote token amount for prices: ', prices);

  const a1 = new BigNumber(prices[0].baseTokenBalance.amount).dividedBy(
    10 ** prices[0].baseTokenDecimals
  );
  const b1 = new BigNumber(prices[0].quoteTokenBalance.amount).dividedBy(
    10 ** prices[0].quoteTokenDecimals
  );

  const a2 = new BigNumber(prices[1].baseTokenBalance.amount).dividedBy(
    10 ** prices[1].baseTokenDecimals
  );
  const b2 = new BigNumber(prices[1].quoteTokenBalance.amount).dividedBy(
    10 ** prices[1].quoteTokenDecimals
  );

  DEBUG('Balances');
  DEBUG(a1.toFixed(), b1.toFixed(), a2.toFixed(), b2.toFixed());

  const feeBasis = new BigNumber(10000);
  const fee1 = feeBasis.minus(prices[0].fee);
  const fee2 = feeBasis.minus(prices[1].fee);

  const numeratorB = feeBasis
    .multipliedBy(a1)
    .multipliedBy(b1)
    .multipliedBy(b2)
    .multipliedBy(fee2);

  const denominatorB = a1
    .multipliedBy(b1)
    .multipliedBy(fee2.exponentiatedBy(2))
    .minus(a2.multipliedBy(b2).multipliedBy(fee1).multipliedBy(fee2));

  const block1 = numeratorB.dividedBy(denominatorB);

  const block2 = a2
    .multipliedBy(b1)
    .multipliedBy(b2)
    .multipliedBy(fee1)
    .multipliedBy(fee2)
    .dividedBy(denominatorB);

  // b² - 4*a*c
  const valueUnderSquareRoot = a1
    .multipliedBy(a2)
    .multipliedBy(b1)
    .multipliedBy(b2)
    .multipliedBy(fee1)
    .multipliedBy(fee2)
    .multipliedBy(
      b1.multipliedBy(fee2).plus(feeBasis.multipliedBy(b2)).exponentiatedBy(2)
    );

  const numerator = valueUnderSquareRoot.squareRoot();
  // (2*a)
  const denominator = a1
    .multipliedBy(b1)
    .multipliedBy(fee2.exponentiatedBy(2))
    .minus(a2.multipliedBy(b2).multipliedBy(fee1).multipliedBy(fee2));
  let x1 = block1
    .negated()
    .minus(block2)
    .minus(numerator.dividedBy(denominator));

  let x2 = block1
    .negated()
    .minus(block2)
    .plus(numerator.dividedBy(denominator));

  const quoteTokenBalanceReserveExchange1 = b1;
  DEBUG('Selecting one quote amount among these');
  DEBUG('x1', x1.toFixed(), 'x2', x2.toFixed());
  x1 =
    x1.isPositive() && x1.isLessThan(quoteTokenBalanceReserveExchange1)
      ? x1
      : new BigNumber(0);
  x2 =
    x2.isPositive() && x2.isLessThan(quoteTokenBalanceReserveExchange1)
      ? x2
      : new BigNumber(0);

  const x = x1.isGreaterThan(x2) ? x1 : x2;

  DEBUG('x', x);
  return x.multipliedBy(10 ** prices[0].quoteTokenDecimals).toFixed(0, 1);
};

/**
 * Profit is in baseToken
 * OptimalAmount is in quoteToken
 */
export const expectedProfitWithFees = (
  optimalAmount: string,
  reserveInSell: string,
  reserveOutSell: string,
  reserveInBuy: string,
  reserveOutBuy: string,
  fee: number
) => {
  const profit = getAmountOutGivenIn(
    optimalAmount,
    reserveOutSell,
    reserveInSell,
    fee
  ).minus(getAmountInGivenOut(optimalAmount, reserveInBuy, reserveOutBuy, fee));
  return profit;
};

function extractCoefficientsOfUnivariateQuadraticFunction(
  price: ExchangePrice[]
) {
  const r1a = new BigNumber(price[0].baseTokenBalance.amount).dividedBy(
    10 ** price[0].baseTokenDecimals
  );
  const r1b = new BigNumber(price[0].quoteTokenBalance.amount).dividedBy(
    10 ** price[0].quoteTokenDecimals
  );
  const r2a = new BigNumber(price[1].baseTokenBalance.amount).dividedBy(
    10 ** price[1].baseTokenDecimals
  );
  const r2b = new BigNumber(price[1].quoteTokenBalance.amount).dividedBy(
    10 ** price[1].quoteTokenDecimals
  );

  // calculate a
  const a = r1a.multipliedBy(r1b).minus(r2a.multipliedBy(r2b));

  // calculate b
  const b = new BigNumber(2)
    .multipliedBy(r1b)
    .multipliedBy(r2b)
    .multipliedBy(r1a.plus(r2a));

  // calculate c
  const c = r1b
    .multipliedBy(r2b)
    .multipliedBy(r1a.multipliedBy(r2b).minus(r2a.multipliedBy(r1b)));

  return { a, b, c };
}
