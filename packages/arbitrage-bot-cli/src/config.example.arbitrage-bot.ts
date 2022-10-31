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
import { InMemorySigner } from '@taquito/signer';


const tokenListTezos: TokenList = [
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

const tokenRegistryTezos = new TokenRegistryPlugin(tokenListTezos);


const exchangeConfigQuipuswap: ExchangePluginConfig = {
  rpc: 'https://mainnet.tezos.marigold.dev/',
  identifier: 'QUIPUSWAP',
  ecosystemIdentifier: 'TEZOS',
  tokenInstances: tokenRegistryTezos,
  exchangeInstances: quipuswapList
};

const exchangeConfigVortex: ExchangePluginConfig = {
  rpc: 'https://mainnet.tezos.marigold.dev/',
  identifier: 'VORTEX',
  ecosystemIdentifier: 'TEZOS',
  tokenInstances: tokenRegistryTezos,
  exchangeInstances: vortexList
};

const getConfig = async () => {
  return {
    baseToken: {
      ticker: 'XTZ',
    },
    quoteToken: {
      ticker: 'SMAK',
    },
    plugins: {
      exchanges: [
        new ExchangeQuipuswapPlugin(exchangeConfigQuipuswap),
        new ExchangeVortexPlugin(exchangeConfigVortex),
      ],
      token: tokenRegistryTezos,
      trigger: new TriggerIntervalPlugin({ interval: 10000 }),
      reporter: new ConsoleReporterPlugin(),
      profitFinder: new ProfitFinderLitePlugin({
        profitSplitForSlippage: 0,
      }),
      keychains: {
      TEZOS: {},
    },
  },
};
