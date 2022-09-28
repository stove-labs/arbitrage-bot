import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import BigNumber from 'bignumber.js';

import { ExchangeQuipuswapPlugin } from '../src/exchangeQuipuswapPlugin';
import { ExchangeRegistry } from '@stove-labs/arbitrage-bot';
import * as errors from '../src/errors';

describe('exchangeQuipuswapPlugin', () => {
  const quipuswapList: ExchangeRegistry  = [
    {
      address: 'KT1Gdix8LoDoQng7YqdPNhdP5V7JRX8FqWvM',
      identifier: 'Quipuswap',
      ticker1: 'XTZ',
      ticker2: 'SMAK',
    },
  ];

  describe('fetchPrice', () => {
    // TODO: mock out Taquito requests for happy path and add test

    it('fails to fetch prices for an unknown token pair (no exchange found in its own registry)', async () => {
      const emptyQuipuswapList = [] as ExchangeRegistry;
      const plugin = new ExchangeQuipuswapPlugin(
        { rpc: 'test_rpc' },
        emptyQuipuswapList
      );

      const promise = plugin.fetchPrice({ ticker: 'XZT' }, { ticker: 'SMAK' });

      await expect(promise).to.eventually.rejectedWith(errors.exchangeNotFound);
    });
  });

  describe('getBalances', () => {
    let plugin;
    const nativeTokenBalance = '3';
    const customTokenBalance = '5';
    const storage = {
      storage: {
        tez_pool: new BigNumber(nativeTokenBalance),
        token_pool: new BigNumber(customTokenBalance),
      },
    };
    beforeEach(() => {
      plugin = new ExchangeQuipuswapPlugin({ rpc: 'test_rpc' }, quipuswapList);
    });

    it('can get balances from storage, when baseToken is XTZ', () => {
      const baseToken = quipuswapList[0].ticker1; // XTZ
      const quoteToken = quipuswapList[0].ticker2; // SMAK

      const balances = plugin.getBalances(
        { ticker: baseToken }, // XTZ
        { ticker: quoteToken }, // SMAK
        storage
      );

      expect(balances.baseTokenBalance).to.equal(nativeTokenBalance);
      expect(balances.quoteTokenBalance).to.equal(customTokenBalance);
    });

    it('can get balances from storage, when quoteToken is XTZ', () => {
      const baseToken = quipuswapList[0].ticker2; // SMAK
      const quoteToken = quipuswapList[0].ticker1; // XTZ

      const balances = plugin.getBalances(
        { ticker: baseToken }, // SMAK
        { ticker: quoteToken }, // XTZ
        storage
      );

      expect(balances.baseTokenBalance).to.equal(customTokenBalance);
      expect(balances.quoteTokenBalance).to.equal(nativeTokenBalance);
    });

    it('returns 0 balance for request without any XTZ ticker', () => {
      const baseToken = 'SMAK';
      const quoteToken = 'SMAK';

      const balances = plugin['getBalances'](
        { ticker: baseToken }, // SMAK
        { ticker: quoteToken }, // SMAK
        storage
      );

      expect(balances.baseTokenBalance).to.equal('0');
      expect(balances.quoteTokenBalance).to.equal('0');
    });
  });
});
