import { expect } from 'chai';
import {
    getAmountInGivenOut,
    getAmountOutGivenIn,
} from '../../../src/pools/xyk/xykPool';

describe('basicPool', () => {
    it('can calculate amountIn for exact amountOut', () => {
        const amountIn = getAmountInGivenOut(
            '174839', // delta_b amountOut
            '12470264', // a1 reserveIn
            '19328447', // b2 reserveOut
            3
        );
        expect(amountIn.toString()).to.equal('113828');
    });

    it('can calculate amountOut for exact amountIn', () => {
        const amountOut = getAmountOutGivenIn(
            '174839', // delta_b amountIn
            '75942969', // b2 reserveIn
            '50125177', // a2 reserveOut
            3
        );
        expect(amountOut.toString()).to.equal('114790');
    });
});
