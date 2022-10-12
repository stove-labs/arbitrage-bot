import {
  ProfitFinderPlugin,
  Swap,
  TokenDecimals,
  TokenPlugin,
  SwapType,
} from '@stove-labs/arbitrage-bot';
import { ExchangePrice, ProfitOpportunity } from '@stove-labs/arbitrage-bot';
import { findOptimalQuoteTokenAmount, orderLowToHigh } from './math';
import { getAmountInGivenOut, getAmountOutGivenIn } from './pools/xyk/xykPool';

export class ProfitFinderLitePlugin implements ProfitFinderPlugin {
  /**
   * profitSplitForSlippage is part of the arbitrage strategy
   * typical value for profitSplitForSlippage
   * profitSplitForSlippage >= 2
   * to deactivate:
   * profitSplitForSlippage = 0
   */
  constructor(
    public config: {
      tokenRegistry: TokenPlugin;
      profitSplitForSlippage: number;
    }
  ) {}

  findProfits(prices: ExchangePrice[]): ProfitOpportunity {
    throwForMissingDecimals(prices);
    const ascendingSpotPrices = orderLowToHigh(prices);
    const quoteTokenAmount = findOptimalQuoteTokenAmount(ascendingSpotPrices);

    const profitOpportunity = createProfitOpportunity(
      ascendingSpotPrices,
      quoteTokenAmount,
      this.config.profitSplitForSlippage
    );

    return profitOpportunity as ProfitOpportunity;
  }
}

const throwForMissingDecimals = (prices: ExchangePrice[]): void => {
  prices.forEach((price) => {
    if (!price.baseTokenDecimals || !price.quoteTokenDecimals) {
      throw new Error(
        `Can't compute profit opportunities for missing token decimals in ExchangePrices`
      );
    }
  });
};

/**
 *
 * @param prices ExchangePrices with token decimals
 * @param amount optimal amount for quote token
 * @param profitSplitForSlippage typical value is >= 2; deactivate with = 0
 * @returns buy and sell swap
 */
export const createProfitOpportunity = (
  prices: ExchangePrice[],
  amount: string,
  profitSplitForSlippage: number
): ProfitOpportunity => {
  /**
   * For ascending spot price order in prices:
   * the first swap is a "buy" for prices[0]
   * the second swap is a "sell" for prices[1]
   */
  const buy = prices[0];
  const sell = prices[1];

  // compute amountIn for buy
  let buyAmountInBaseToken = getAmountInGivenOut(
    amount, // optimal amount of quoteToken
    buy.baseTokenBalance.amount, // reserveIn in base token
    buy.quoteTokenBalance.amount, // reserveOut in quote token
    buy.fee
  );

  // compute amountOut for sell
  const sellAmountOutBaseToken = getAmountOutGivenIn(
    amount, // optimal amount of quoteToken
    sell.quoteTokenBalance.amount, // reserveIn flipped, it is quote token
    sell.baseTokenBalance.amount, // reserveOut flipped, it is base token
    sell.fee
  );

  const profit = sellAmountOutBaseToken.minus(buyAmountInBaseToken);

  const limitDelta =
    profitSplitForSlippage === 0 ? 0 : profit.dividedBy(profitSplitForSlippage);

  const buyLimit = buyAmountInBaseToken.plus(limitDelta);

  /**
   * tokenIn: baseToken
   * tokenOut: quoteToken
   * amount: calculated optimal amountOut in quoteToken
   * type: buy
   * limit: expected amountIn in baseToken + fraction of
   * expected profit as slippage according to profitSplitForSlippage
   */
  const swapBuy: Swap = {
    amount,
    limit: buyLimit.toString(),
    limitWithoutSlippage: buyAmountInBaseToken.toString(),
    tokenIn: buy.baseToken,
    tokenInDecimals: buy.baseTokenDecimals,
    tokenOutDecimals: buy.quoteTokenDecimals,
    tokenOut: buy.quoteToken,
    type: SwapType.BUY,
    identifier: buy.identifier,
    ecosystemIdentifier: buy.ecosystemIdentifier,
  };

  const sellLimit = sellAmountOutBaseToken.minus(limitDelta);

  /**
   * tokenIn: quoteToken
   * tokenOut: baseToken
   * amount: calculated optimal amountIn in quoteToken
   * type: sell
   * limit: expected amountIn in baseToken + fraction of
   * expected profit as slippage according to profitSplitForSlippage
   */
  const swapSell: Swap = {
    amount,
    limit: sellLimit.toString(),
    limitWithoutSlippage: sellAmountOutBaseToken.toString(),
    tokenIn: sell.quoteToken,
    tokenInDecimals: sell.quoteTokenDecimals,
    tokenOutDecimals: sell.baseTokenDecimals,
    tokenOut: sell.baseToken,
    type: SwapType.SELL,
    identifier: sell.identifier,
    ecosystemIdentifier: sell.ecosystemIdentifier,
  };

  return {
    swaps: [swapBuy, swapSell],
    profit: { baseTokenAmount: profit.toString() },
  } as ProfitOpportunity;
};
