import { BigNumber } from 'bignumber.js';
import { basisPoints } from '../../constants';
// Uniswap V2 CFMM a.k.a. x*y=k

/**
 * Example for fee = 0.03% which is 30 BPS out of 10000 BPS
 * amountIn = (amountOut * 10000 * reserveIn) / ((reserveOut - amountOut) * 9970)
 */
export const getAmountInGivenOut = (
  amountOut: string,
  reserveIn: string,
  reserveOut: string,
  fee: number
) => {
  const amountOutBN = new BigNumber(amountOut);

  const numerator = amountOutBN
    .multipliedBy(basisPoints)
    .multipliedBy(reserveIn);
  const denominator = new BigNumber(reserveOut)
    .minus(amountOut)
    .multipliedBy(basisPoints - fee);

  return numerator.idiv(denominator).plus(1);
};

/**
 * Example for fee = 0.03% which is 30 BPS out of 10000 BPS
 * amountOut = (amountIn * 9970 * reserveOut) / (reserveIn * 10000 + amountIn * 9970)
 */
export const getAmountOutGivenIn = (
  amountIn: string,
  reserveIn: string,
  reserveOut: string,
  fee: number
) => {
  const amountInBN = new BigNumber(amountIn);
  const amountInWithFee = amountInBN.multipliedBy(basisPoints - fee);

  const numerator = amountInWithFee.multipliedBy(reserveOut);
  const denominator = new BigNumber(reserveIn)
    .multipliedBy(basisPoints)
    .plus(amountInWithFee);

  return numerator.idiv(denominator);
};
