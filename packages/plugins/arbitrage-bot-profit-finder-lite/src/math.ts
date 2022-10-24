import { ExchangePrice } from '@stove-labs/arbitrage-bot';
import { getAmountInGivenOut, getAmountOutGivenIn } from './pools/xyk/xykPool';
import { BigNumber } from 'bignumber.js';
import { basisPoints } from './constants';
import _ from 'lodash';

// for DEBUG output
const argv = require('yargs/yargs')(process.argv.slice(2))
  .count('verbose')
  .alias('v', 'verbose').argv;
const VERBOSE_LEVEL = argv.verbose;
const DEBUG = VERBOSE_LEVEL >= 2 ? console.log : () => {};

/**
 * Orders exchange prices from low to high spot price based on baseToken and quoteToken definition.
 */
export const orderLowToHigh = (prices: ExchangePrice[]): ExchangePrice[] => {
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
 * Limited to buy/sell strategy thus 2 swaps total.
 *
 * a*x^2+b*x+c=0
 * x1 = (- b + sqrt(b² - 4*a*c))/(2*a)
 * x2 = (- b - sqrt(b² - 4*a*c))/(2*a)
 */
export const findOptimalQuoteTokenAmount = (prices: ExchangePrice[]) => {
  DEBUG('Finding optimal quote token amount for prices: ', prices);

  const { a1, b1, a2, b2 } = extractBalancesWithDecimals(prices);

  const { feeBasis, fee2, fee1 } = getFeeConstants(prices);

  // -b = -bPart1 - bPart2
  const numeratorB = feeBasis
    .multipliedBy(a1)
    .multipliedBy(b1)
    .multipliedBy(b2)
    .multipliedBy(fee2);

  const denominatorB = a1
    .multipliedBy(b1)
    .multipliedBy(fee2.exponentiatedBy(2))
    .minus(a2.multipliedBy(b2).multipliedBy(fee1).multipliedBy(fee2));

  const bPart1 = numeratorB.dividedBy(denominatorB);

  const bPart2 = a2
    .multipliedBy(b1)
    .multipliedBy(b2)
    .multipliedBy(fee1)
    .multipliedBy(fee2)
    .dividedBy(denominatorB);

  const b = bPart1.negated().minus(bPart2);

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

  // x1 = (- b + sqrt(b² - 4*a*c))/(2*a)
  let x1 = bPart1
    .negated()
    .minus(bPart2)
    .minus(numerator.dividedBy(denominator));

  // x2 = (- b - sqrt(b² - 4*a*c))/(2*a)
  let x2 = bPart1
    .negated()
    .minus(bPart2)
    .plus(numerator.dividedBy(denominator));

  DEBUG('Selecting one quote amount from these values');
  DEBUG('x1', x1.toFixed(), 'x2', x2.toFixed());

  const quoteTokenBalanceReserveExchange1 = b1;

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

  return x.multipliedBy(10 ** prices[0].quoteToken.decimals).toFixed(0, 1);
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

/**
 * Limited buy/sell strategy thus 2 swaps in total.
 * 
 * @param prices needs to be ordered from low to high spot prices
 * @returns feeBasis, fee1 or the buy swap, fee2 of the sell swap
 */
function getFeeConstants(prices: ExchangePrice[]) {
  const feeBasis = new BigNumber(basisPoints);

  const buySwap = prices[0];
  const fee1 = feeBasis.minus(buySwap.fee);

  const sellSwap = prices[1];
  const fee2 = feeBasis.minus(sellSwap.fee);

  return { feeBasis, fee2, fee1 };
}

function extractBalancesWithDecimals(prices: ExchangePrice[]) {
  const a1 = new BigNumber(prices[0].baseTokenBalance.amount).dividedBy(
    10 ** prices[0].baseToken.decimals
  );
  const b1 = new BigNumber(prices[0].quoteTokenBalance.amount).dividedBy(
    10 ** prices[0].quoteToken.decimals
  );

  const a2 = new BigNumber(prices[1].baseTokenBalance.amount).dividedBy(
    10 ** prices[1].baseToken.decimals
  );
  const b2 = new BigNumber(prices[1].quoteTokenBalance.amount).dividedBy(
    10 ** prices[1].quoteToken.decimals
  );

  DEBUG('Balances');
  DEBUG(a1.toFixed(), b1.toFixed(), a2.toFixed(), b2.toFixed());
  return { a1, b1, a2, b2 };
}
