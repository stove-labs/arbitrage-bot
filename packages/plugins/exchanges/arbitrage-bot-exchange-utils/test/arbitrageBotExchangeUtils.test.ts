import { expect } from 'chai';
import { getExchangeAddressFromRegistry } from '../src/arbitrageBotExchangeUtils';

describe('arbitrageBotExchangeUtils', () => {
    describe('getExchangeAddressFromRegistry', () => {
        const exchangeList = [
            {
                address: 'KT1addressXTZ-SMAK',
                identifier: 'Quipuswap',
                ticker1: 'XTZ',
                ticker2: 'SMAK',
            },
            {
                address: 'KT1addressXTZ-uUSD',
                identifier: 'Quipuswap',
                ticker1: 'XTZ',
                ticker2: 'uUSD',
            },
        ];
        it('can get exchange address for token pair', () => {
            const exchangeAddress = getExchangeAddressFromRegistry(
                { ticker: 'XTZ' }, // token1
                { ticker: 'SMAK' }, // token2
                exchangeList // instances
            );
            expect(exchangeAddress).to.equal('KT1addressXTZ-SMAK')
        });

        it('can get exchange address for token pair in any ticker order', () => {
            const exchangeAddress = getExchangeAddressFromRegistry(
                { ticker: 'SMAK' }, // token1
                { ticker: 'XTZ' }, // token2
                exchangeList // instances
            );
            expect(exchangeAddress).to.equal('KT1addressXTZ-SMAK')
        });

        it('returns undefined for unknown exchange instance', () => {
            const exchangeAddress = getExchangeAddressFromRegistry(
                { ticker: 'SMAK' }, // token1
                { ticker: 'SMAK' }, // token2
                exchangeList // instances
            );
            expect(exchangeAddress).to.be.undefined
        });

    });
});
