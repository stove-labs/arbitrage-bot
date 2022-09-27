import { expect } from 'chai';
import { TokenRegistry } from '../src/tokenRegistry';
import * as constants from '../src/constants';
import { TokenList } from '@stove-labs/arbitrage-bot';

const tokenRegistry = [
    {
        ticker: 'XTZ',
        address: constants.nativeTokenAddressIdentifier,
        decimals: 6,
        ecosystemIdentifier: 'TEZOS',
        tokenId: undefined
    },
    {
        ticker: 'SMAK',
        address: 'KT1SMAK',
        decimals: 3,
        ecosystemIdentifier: 'TEZOS',
        tokenId: undefined
    },
    {
        ticker: 'uUSD',
        address: 'KT1UUSD',
        tokenId: 0,
        decimals: 6,
        ecosystemIdentifier: 'TEZOS',
    },
];

describe('tokenRegistry', () => {
    let plugin;
    beforeEach(() => {
        plugin = new TokenRegistry(tokenRegistry as TokenList);
    });

    it('can retrieve a native token', () => {
        const address = plugin.getTokenAddress({ ticker: 'XTZ' }, 'TEZOS');

        expect(address).to.equal(constants.nativeTokenAddressIdentifier);
    });

    it('can retrieve a FA1.2 token', () => {
        const ticker = 'SMAK';
        const address = plugin.getTokenAddress({ ticker }, 'TEZOS');

        expect(address).to.equal(
            tokenRegistry.find((token) => token.ticker === ticker)?.address
        );
    });

    it('can retrieve a FA2 token', () => {
        const ticker = 'uUSD';
        const address = plugin.getTokenAddress({ ticker }, 'TEZOS');

        expect(address).to.equal(
            tokenRegistry.find((token) => token.ticker === ticker)?.address
        );
    });
});
