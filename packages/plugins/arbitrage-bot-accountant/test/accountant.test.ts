import { Accountant } from '../src/accountant';
import { expect } from 'chai';
import { TokenList, TokenPlugin } from '@stove-labs/arbitrage-bot';
import { TokenRegistryPlugin } from '@stove-labs/arbitrage-bot-token-registry';
import {
  getMockTezosToolkit,
  mockedTokenBalance,
  mockedXtzBalance,
} from './helpers';

describe('Accountant', () => {
  const botAddress = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';
  it('can create an Accountant instance', () => {
    const accountant = new Accountant({ TEZOS: '' }, {} as TokenPlugin, {
      TEZOS: '',
    });

    expect(accountant).to.be.instanceOf(Accountant);
  });

  const tokenList = [
    {
      ticker: 'XTZ',
      address: 'native',
      decimals: 6,
      ecosystemIdentifier: 'TEZOS',
    },
    {
      ticker: 'kUSD',
      address: 'KT1D6qZuaM5kLsprnE1GFsLthofhiuX3jox8',
      decimals: 18,
      ecosystemIdentifier: 'TEZOS',
    },
  ] as TokenList;

  it('can fetch XTZ balance', async () => {
    const accountant = new Accountant(
      { TEZOS: botAddress },
      new TokenRegistryPlugin(tokenList),
      {
        TEZOS: getMockTezosToolkit(),
      }
    );

    const balance = await accountant.getBalance({ ticker: 'XTZ' }, 'TEZOS');

    expect(balance.balance.amount).to.equal(mockedXtzBalance);
  });

  it('can fetch token balance', async () => {
    const accountant = new Accountant(
      { TEZOS: botAddress },
      new TokenRegistryPlugin(tokenList),
      {
        TEZOS: getMockTezosToolkit(),
      }
    );

    const balance = await accountant.getBalance({ ticker: 'kUSD' }, 'TEZOS');

    expect(balance.balance.amount).to.equal(mockedTokenBalance);
  });
});
