import { expect } from 'chai';
import {
    getAmountInGivenOut,
    getAmountOutGivenIn,
} from '../../../src/pools/basic/basicPool';

describe('basicPool', () => {
    it('can calculate amountIn for exact amountOut', () => {
        const amountIn = getAmountInGivenOut(
            '174839',
            '12470264',
            '19328447',
            3
        );
        expect(amountIn.toString()).to.equal('113828');
    });

    it('can calculate amountOut for exact amountIn', () => {
        const amountOut = getAmountOutGivenIn(
            '174839',
            '75942969',
            '50125177',
            3
        );
        expect(amountOut.toString()).to.equal('114790');
    });
});
