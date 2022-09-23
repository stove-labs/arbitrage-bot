import { ExchangePrice } from '@stove-labs/arbitrage-bot';
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
        exchangePrice.spotPrice = new BigNumber(
            exchangePrice.baseTokenBalance.amount
        )
            .dividedBy(exchangePrice.quoteTokenBalance.amount)
            .toNumber();

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
    prices = addSpotPrice(prices);

    return _.orderBy(prices, ['spotPrice'], 'asc');
};

type SwapBuy = { reserveIn: string; reserveOut: string };
type SwapSell = { reserveIn: string; reserveOut: string };
export type TradingStrategy = {
    swapBuy: SwapBuy;
    swapSell: SwapSell;
};

/**
 * SpotPrice 0.1 quoteToken/baseToken USD/XTZ
 * SpotPrice 0.2 quoteToken/baseToken USD/XTZ
 */
export const splitIntoBuySell = (prices: ExchangePrice[]): TradingStrategy => {
    // get where spot price lower => amountInGivenOut => BUY
    const exchangeBuy = {
        reserveIn: prices[0].baseTokenBalance.amount,
        reserveOut: prices[0].quoteTokenBalance.amount,
    } as SwapBuy;
    // get where spot price higher => amountOutGivenIn => SELL
    const exchangeSell = {
        // notice that quote and base token are flipped here!
        reserveIn: prices[1].quoteTokenBalance.amount,
        reserveOut: prices[1].baseTokenBalance.amount,
    } as SwapSell;
    return { swapBuy: exchangeBuy, swapSell: exchangeSell };
};

// https://www.notion.so/stove-labs/Profit-Finder-d5844bc7e4ec4db48b2bfe395d42c256#7c18595d89fd4e5c9c7c122e47c2a22b
/**
 * Units:
 * reserveInBuy = reserveOutSell = token
 */
export const findOptimalAmount = (dex: TradingStrategy) => {
    // Univariate quadratic function with coefficients a,b,c f(x)=a*x^2+b*x+c=0
    const { a, b, c } = extractCoefficientsOfUnivariateQuadraticFunction(dex);

    // Solving the quadratic function yields x1 and x2
    // x1 = (- b + sqrt(b² - 4*a*c))/(2*a)
    // x2 = - b - sqrt(b² - 4*a*c)/(2*a)
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
    let x;
    if (x1.isPositive() && x1.isLessThan(dex.swapBuy.reserveOut)) {
        x = x1;
    } else if (
        x2.isPositive() &&
        x2.isLessThan(dex.swapBuy.reserveOut) &&
        x2.isGreaterThan(x1)
    ) {
        x = x2;
    } else {
        x = new BigNumber(0);
    }
    return x;
};

// https://www.notion.so/stove-labs/Profit-Finder-d5844bc7e4ec4db48b2bfe395d42c256#a13825caae334a9299d86ef06801709d
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
    ).minus(
        getAmountInGivenOut(optimalAmount, reserveInBuy, reserveOutBuy, fee)
    );
    return profit;
};
function extractCoefficientsOfUnivariateQuadraticFunction(
    dex: TradingStrategy
) {
    const productBuyReserves = new BigNumber(
        dex.swapBuy.reserveIn
    ).multipliedBy(dex.swapBuy.reserveOut);
    const productSellReserves = new BigNumber(
        dex.swapSell.reserveIn
    ).multipliedBy(dex.swapSell.reserveOut);
    const a = productBuyReserves.minus(productSellReserves);
    console.log('a', a.toString());
    // calculate b
    const b = new BigNumber(2)
        .multipliedBy(dex.swapBuy.reserveOut)
        .multipliedBy(dex.swapSell.reserveOut)
        .multipliedBy(
            new BigNumber(dex.swapBuy.reserveIn).plus(dex.swapSell.reserveIn)
        );
    console.log('b', b.toString());
    // calculate c
    const c = new BigNumber(dex.swapBuy.reserveOut)
        .multipliedBy(dex.swapSell.reserveOut)
        .multipliedBy(
            new BigNumber(dex.swapBuy.reserveIn)
                .multipliedBy(dex.swapSell.reserveOut)
                .minus(
                    new BigNumber(dex.swapSell.reserveIn).multipliedBy(
                        dex.swapBuy.reserveOut
                    )
                )
        );
    console.log('c', c.toString());
    return { a, b, c };
}
