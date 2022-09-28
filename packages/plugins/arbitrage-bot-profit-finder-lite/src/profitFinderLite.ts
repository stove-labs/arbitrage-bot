import {
  ProfitFinderPlugin,
  Swap,
  TokenDecimals,
  TokenPlugin,
  SwapType,
} from '@stove-labs/arbitrage-bot';
import { ExchangePrice, ProfitOpportunity } from '@stove-labs/arbitrage-bot';
import {
  expectedProfitWithFees,
  findOptimalQuoteTokenAmount,
  orderLowToHigh,
  splitIntoBuySell,
  TradingStrategy,
} from './math';
import {
  getAmountInGivenOut,
  getAmountOutGivenIn,
} from './pools/basic/basicPool';

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
    // TODO: extract token decimals as property of class
    const tokenDecimals = this.config.tokenRegistry.getTokenDecimals(prices);
    const ascendingSpotPrices = orderLowToHigh(prices, tokenDecimals);
    const tradingStrategy = splitIntoBuySell(ascendingSpotPrices);
    const quoteTokenAmount = findOptimalQuoteTokenAmount(
      tradingStrategy,
      tokenDecimals
    );

    const profitOpportunity = createProfitOpportunity(
      tradingStrategy,
      quoteTokenAmount,
      tokenDecimals,
      this.config.profitSplitForSlippage // typical value is anything above 2; deactivating it set to 1
    );

    // expectedProfitWithFees(amount, prices)
    return profitOpportunity as ProfitOpportunity;
  }
}

export const createProfitOpportunity = (
  dex: TradingStrategy,
  amount: string,
  tokenDecimals: TokenDecimals,
  profitSplitForSlippage: number
): ProfitOpportunity => {
  console.log('dex.swapBuy', dex.swapBuy, 'amount', amount)
  const buyAmountInBaseToken = getAmountInGivenOut(
    amount,
    dex.swapBuy.reserveIn,
    dex.swapBuy.reserveOut,
    3
  );

  console.log('buyAmountInBaseToken',buyAmountInBaseToken.toString())

  const sellAmountOutBaseToken = getAmountOutGivenIn(
    amount,
    dex.swapSell.reserveIn,
    dex.swapSell.reserveOut,
    3
  );
  const profit = sellAmountOutBaseToken
    .minus(buyAmountInBaseToken)
    .multipliedBy(10 ** tokenDecimals.baseToken);

  const buyLimit = buyAmountInBaseToken
    .multipliedBy(10 ** tokenDecimals.baseToken)
    .plus(profit.dividedBy(profitSplitForSlippage));

  /**
   * tokenIn: baseToken
   * tokenOut: quoteToken
   * amount: calculated optimal amountOut in quoteToken
   * type: buy
   * limit: expected amountIn in baseToken + 1/2 expected profit as slippage
   */
  const swapBuy: Swap = {
    tokenIn: dex.swapBuy.tokenIn,
    tokenOut: dex.swapBuy.tokenOut,
    amount,
    type: SwapType.BUY,
    limit: buyLimit.toFixed(0, 1),
  };

  const sellLimit = sellAmountOutBaseToken
    .multipliedBy(10 ** tokenDecimals.baseToken)
    .minus(profit.dividedBy(profitSplitForSlippage));

  /**
   * tokenIn: quoteToken
   * tokenOut: baseToken
   * amount: calculated optimal amountIn in quoteToken
   * type: sell
   * limit: expected amountOut in baseToken + 1/2 expected profit as slippage
   */
  const swapSell: Swap = {
    tokenIn: dex.swapSell.tokenIn,
    tokenOut: dex.swapSell.tokenOut,
    amount,
    type: SwapType.SELL,
    limit: sellLimit.toFixed(0, 1),
  };

  return {
    swaps: [swapBuy, swapSell],
    profit: { baseTokenAmount: profit.toFixed(0, 1) },
  } as ProfitOpportunity;
};
