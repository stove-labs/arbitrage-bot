import {
  ProfitFinderPlugin,
  Swap,
  TokenDecimals,
  TokenPlugin,
  SwapType,
} from '@stove-labs/arbitrage-bot';
import { ExchangePrice, ProfitOpportunity } from '@stove-labs/arbitrage-bot';
import {
  findOptimalQuoteTokenAmount,
  orderLowToHigh,
} from './math';
import {
  getAmountInGivenOut,
  getAmountOutGivenIn,
} from './pools/xyk/xykPool';

export class ProfitFinderLitePlugin implements ProfitFinderPlugin {
  /**
   *
   * profitSplitForSlippage is part of the arbitrage strategy
   * typical value for profitSplitForSlippage
   * profitSplitForSlippage >= 2
   * to deactivate:
   * profitSplitForSlippage = 1
   */
  constructor(
    public config: {
      tokenRegistry: TokenPlugin;
      profitSplitForSlippage: number;
    }
  ) {}

  findProfits(prices: ExchangePrice[]): ProfitOpportunity {
    const tokenDecimals = this.config.tokenRegistry.getTokenDecimals(prices);
    const pricesWithDecimals = addTokenDecimals(prices, tokenDecimals);
    const ascendingSpotPrices = orderLowToHigh(pricesWithDecimals);
    const quoteTokenAmount = findOptimalQuoteTokenAmount(ascendingSpotPrices);

    const profitOpportunity = createProfitOpportunity(
      prices,
      quoteTokenAmount,
      this.config.profitSplitForSlippage
    );

    // expectedProfitWithFees(amount, prices)
    return profitOpportunity as ProfitOpportunity;
  }
}

const addTokenDecimals = (
  prices: ExchangePrice[],
  tokenDecimals: TokenDecimals
): ExchangePrice[] => {
  return prices.map((exchangePrice) => {
    exchangePrice.baseTokenDecimals = tokenDecimals.baseToken;
    exchangePrice.quoteTokenDecimals = tokenDecimals.quoteToken;
    return exchangePrice;
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
  const buyAmountInBaseToken = getAmountInGivenOut(
    amount, // optimal amount of quoteToken
    buy.baseTokenBalance.amount, // reserveIn in base token
    buy.quoteTokenBalance.amount, // reserveOut in quote token
    3
  );

  // compute amountOut for sell
  const sellAmountOutBaseToken = getAmountOutGivenIn(
    amount, // optimal amount of quoteToken
    sell.quoteTokenBalance.amount, // reserveIn flipped, it is quote token
    sell.baseTokenBalance.amount, // reserveOut flipped, it is base token
    3
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
   * limit: expected amountIn in baseToken + 1/2 expected profit as slippage
   */
  const swapBuy: Swap = {
    tokenIn: buy.baseToken,
    tokenOut: buy.quoteToken,
    amount,
    type: SwapType.BUY,
    limit: buyLimit.toString(),
    limitWithoutSlippage: buyAmountInBaseToken.toString(),
  };

  const sellLimit = sellAmountOutBaseToken.minus(limitDelta);

  /**
   * tokenIn: quoteToken
   * tokenOut: baseToken
   * amount: calculated optimal amountIn in quoteToken
   * type: sell
   * limit: expected amountOut in baseToken + 1/2 expected profit as slippage
   */
  const swapSell: Swap = {
    tokenIn: sell.quoteToken,
    tokenOut: sell.baseToken,
    amount,
    type: SwapType.SELL,
    limit: sellLimit.toString(),
    limitWithoutSlippage: sellAmountOutBaseToken.toString(),
  };

  return {
    swaps: [swapBuy, swapSell],
    profit: { baseTokenAmount: profit.toString() },
  } as ProfitOpportunity;
};
