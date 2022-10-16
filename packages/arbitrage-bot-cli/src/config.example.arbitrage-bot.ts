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
import { ExchangeVortexPlugin } from '@stove-labs/tezos-dex-vortex';

const exchangeConfigQuipuswap: ExchangePluginConfig = {
  rpc: 'https://mainnet.smartpy.io',
  identifier: 'QUIPUSWAP',
  ecosystemIdentifier: 'TEZOS',
};

const exchangeConfigVortex: ExchangePluginConfig = {
  rpc: 'https://mainnet.smartpy.io',
  identifier: 'VORTEX',
  ecosystemIdentifier: 'TEZOS',
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
    address: 'KT1TwzD6zV3WeJ39ukuqxcfK2fJCnhvrdN1X',
    decimals: 3,
    ecosystemIdentifier: 'TEZOS',
  },
  {
    ticker: 'kUSD',
    address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
    decimals: 18,
    ecosystemIdentifier: 'TEZOS',
  },
];

const quipuswapList: ExchangeRegistry = [
  {
    address: 'KT1Gdix8LoDoQng7YqdPNhdP5V7JRX8FqWvM',
    identifier: 'QUIPUSWAP',
    ticker1: 'XTZ',
    ticker2: 'SMAK',
  },
  {
    address: 'KT1K4EwTpbvYN9agJdjpyJm4ZZdhpUNKB3F6',
    identifier: 'QUIPUSWAP',
    ticker1: 'XTZ',
    ticker2: 'kUSD',
  },
];

const vortexList: ExchangeRegistry = [
  {
    address: 'KT1LzyPS8rN375tC31WPAVHaQ4HyBvTSLwBu',
    identifier: 'VORTEX',
    ticker1: 'XTZ',
    ticker2: 'SMAK',
  },
  {
    address: 'KT1Wjadao8AXkwNQmjstbPGtLd1ZrUyQEDX7',
    identifier: 'VORTEX',
    ticker1: 'XTZ',
    ticker2: 'kUSD',
  },
];

const tokenRegistry = new TokenRegistryPlugin(tokenList);

export const config: Config = {
  baseToken: {
    ticker: 'XTZ',
  },
  quoteToken: {
    ticker: 'SMAK',
  },
  plugins: {
    exchanges: [
      new ExchangeQuipuswapPlugin(exchangeConfigQuipuswap, quipuswapList),
      new ExchangeVortexPlugin(exchangeConfigVortex, vortexList),
    ],
    token: tokenRegistry,
    trigger: new TriggerIntervalPlugin({ interval: 20000 }),
    reporter: new ConsoleReporterPlugin(),
    profitFinder: new ProfitFinderLitePlugin({
      tokenRegistry,
      profitSplitForSlippage: 0,
    }),
    keychains: {
      TEZOS: {},
    },
  },
};
