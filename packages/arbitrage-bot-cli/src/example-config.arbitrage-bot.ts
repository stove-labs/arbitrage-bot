import {
  Config,
  ExchangePluginConfig,
  ExchangeRegistry,
  TokenList,
} from '@stove-labs/arbitrage-bot';
import { ExchangeQuipuswapPlugin } from '@stove-labs/tezos-dex-quipuswap';
import { TriggerIntervalPlugin } from '@stove-labs/arbitrage-bot-trigger';
import { ConsoleReporterPlugin } from '@stove-labs/arbitrage-bot-reporter';
import { ProfitFinderLitePlugin } from '@stove-labs/arbitrage-bot-profit-finder-lite';
import { TokenRegistryPlugin } from '@stove-labs/arbitrage-bot-token-registry';

const exchangeConfigQuipuswap1: ExchangePluginConfig = {
  rpc: 'http://127.0.0.1:20000',
  identifier: 'QUIPUSWAP',
  ecosystemIdentifier: 'TEZOS'
};

const exchangeConfigQuipuswap2: ExchangePluginConfig = {
  rpc: 'http://127.0.0.1:20000',
  identifier: 'QUIPUSWAP2',
  ecosystemIdentifier: 'TEZOS'
};

const tokenList: TokenList = [
  {
    ticker: 'XTZ',
    address: 'native',
    decimals: 6,
    ecosystemIdentifier: 'TEZOS',
  },
  {
    ticker: 'SMAK',
    address: 'KT1...',
    decimals: 3,
    ecosystemIdentifier: 'TEZOS',
  },
  {
    ticker: 'USD',
    address: 'KT1WCcNF89rFB3jzhLJfeHh6yhSneMMu5Pb5',
    decimals: 12,
    ecosystemIdentifier: 'TEZOS',
  },
];

const quipuswapList: ExchangeRegistry = [
  {
    address: 'KT1ADHpHowU8nshdYj2gzwFoXiZgMG7PPk7A',
    identifier: 'QUIPUSWAP1',
    ticker1: 'XTZ',
    ticker2: 'USD',
  },
];

const quipuswapList2: ExchangeRegistry = [
  {
    address: 'KT1RThWFuFHFqQxWEQZzQo2xGttB2ZMRvraZ',
    identifier: 'QUIPUSWAP2',
    ticker1: 'XTZ',
    ticker2: 'USD',
  },
];

const tokenRegistry = new TokenRegistryPlugin(tokenList);

export const config: Config = {
  baseToken: {
    ticker: 'USD',
  },
  quoteToken: {
    ticker: 'XTZ',
  },
  plugins: {
    exchanges: [
      new ExchangeQuipuswapPlugin(exchangeConfigQuipuswap1, quipuswapList),
      new ExchangeQuipuswapPlugin(exchangeConfigQuipuswap2, quipuswapList2),
    ],
    token: tokenRegistry,
    trigger: new TriggerIntervalPlugin({ interval: 5000 }),
    reporter: new ConsoleReporterPlugin(),
    profitFinder: new ProfitFinderLitePlugin({
      tokenRegistry,
      profitSplitForSlippage: 0,
    }),
    // accountants: deal with the balances in a plugin
    // orchestrated by AccountantManager that does summing up of token balances across accountants
    // [new AccountantTezosPlugin()]
    keychains: {
      // !!! keychain is responsible for signing
      TEZOS: {},
      // TEZOS: new KeychainTezosInMemoryPlugin({
      //   privateKey: "...",
      // }), // this plugin has a .sign(batchSwaps) or something...
    },
  },
};
