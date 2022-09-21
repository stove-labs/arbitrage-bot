import { BigNumber } from 'bignumber.js';
import { basisPoints } from '../../constants';
// Uniswap V2 CFMM a.k.a. x*y=k

/**
 * Example for fee = 0.03% which is 3 BPS out of 1000 BPS
 * amountIn = (amountOut * 1000 * reserveIn) / (reserveOut * 1000 - amountOut * 997)
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
        .multipliedBy(basisPoints)
        .minus(amountOutBN.multipliedBy(basisPoints - fee));

    return numerator.idiv(denominator);
};

export const calculateAmountOutExactIn = () => {
    return;
};
