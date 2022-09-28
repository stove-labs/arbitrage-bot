import { ExchangePrice, } from '@stove-labs/arbitrage-bot';
import {
  getAmountInGivenOut,
  getAmountOutGivenIn,
} from './pools/basic/basicPool';
import { BigNumber } from 'bignumber.js';
import _ from 'lodash';

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
 * Units:
 * buy.tokenOut = sell.tokenIn [token amount]
 */
export const findOptimalQuoteTokenAmount = (
  prices: ExchangePrice[]
): string => {
  // Univariate quadratic function with coefficients a,b,c f(x)=a*x^2+b*x+c=0
  const { a, b, c } = extractCoefficientsOfUnivariateQuadraticFunction(prices);

  // Solving the quadratic function yields x1 and x2
  // x1 = (- b + sqrt(b² - 4*a*c))/(2*a)
  // x2 = (- b - sqrt(b² - 4*a*c))/(2*a)
  const valueInSquareRoot = b
    .pow(2)
    .minus(new BigNumber(4).multipliedBy(a).multipliedBy(c));
  // solving for x1
  const x1 = b
    .negated()
    .plus(valueInSquareRoot.squareRoot())
    .dividedBy(new BigNumber(2).multipliedBy(a));
  // solving for x2
  const x2 = b
    .negated()
    .minus(valueInSquareRoot.squareRoot())
    .dividedBy(new BigNumber(2).multipliedBy(a));

  // pick x based on constraints
  const quoteTokenBalanceReserveExchange1 = new BigNumber(
    prices[0].quoteTokenBalance.amount
  ).multipliedBy(10 ** prices[0].quoteTokenDecimals);

  let x: BigNumber;

  if (x1.isPositive() && x1.isLessThan(quoteTokenBalanceReserveExchange1)) {
    x = x1;
  } else if (
    x2.isPositive() &&
    x2.isLessThan(quoteTokenBalanceReserveExchange1) &&
    x2.isGreaterThan(x1)
  ) {
    x = x2;
  } else {
    x = new BigNumber(0);
  }

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
