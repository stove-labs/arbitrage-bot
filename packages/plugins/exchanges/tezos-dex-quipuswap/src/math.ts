import { TokenFA12, TokenFA2 } from '@stove-labs/arbitrage-bot';
import { BigNumber } from 'bignumber.js';
import { Balances } from './types/types';

/**
 * Spot price = baseToken/quoteToken
 * eg. XTZ/USD = 0.65 XTZ/USD
 * pay 0.65 XTZ
 * receive 1 USD
 */
export const calculateSpotPrice = (
  balances: Balances,
  baseTokenWithInfo: TokenFA12 | TokenFA2,
  quoteTokenWithInfo: TokenFA12 | TokenFA2
) => {
  const baseTokenReserve = new BigNumber(balances.baseTokenBalance).dividedBy(
    10 ** baseTokenWithInfo.decimals
  );

  const quoteTokenReserve = new BigNumber(balances.quoteTokenBalance).dividedBy(
    10 ** quoteTokenWithInfo.decimals
  );

  const spotPrice = baseTokenReserve
    .dividedBy(quoteTokenReserve)
    .multipliedBy(10 ** baseTokenWithInfo.decimals)
    .toFixed(0, 1);

  return spotPrice;
};
