import {
  Config,
  ExchangePluginConfig,
  ExchangeRegistry,
} from '@stove-labs/arbitrage-bot';
import { ExchangeQuipuswapPlugin } from '@stove-labs/tezos-dex-quipuswap';
import { TriggerIntervalPlugin } from '@stove-labs/arbitrage-bot-trigger-interval';
// import { TriggerChainPlugin } from '@stove-labs/arbitrage-bot-trigger-chain';
import { ConsoleReporterPlugin } from '@stove-labs/arbitrage-bot-reporter';
import { ProfitFinderLitePlugin } from '@stove-labs/arbitrage-bot-profit-finder-lite';
import { TokenRegistryPlugin } from '@stove-labs/arbitrage-bot-token-registry';
import { ExchangeVortexPlugin } from '@stove-labs/tezos-dex-vortex';
import { InMemorySigner } from '@taquito/signer';
import { Accountant } from '@stove-labs/arbitrage-bot-accountant';

import tokens from './tokens';
import quipuswapExchangeRegistry from './quipuswap';
import vortexExchangeRegistry from './vortex';

const tokenRegistryPlugin = new TokenRegistryPlugin(tokens);
const a = quipuswapExchangeRegistry as ExchangeRegistry;
const tezosRpc = 'https://mainnet.tezos.marigold.dev';
const quipuswapExchangeConfig: ExchangePluginConfig = {
  rpc: tezosRpc,
  identifier: 'QUIPUSWAP',
  ecosystemIdentifier: 'TEZOS',
  tokenInstances: tokenRegistryPlugin,
  exchangeInstances: a,
};

const b = vortexExchangeRegistry as ExchangeRegistry;
const vortexExchangeConfig: ExchangePluginConfig = {
  rpc: tezosRpc,
  identifier: 'VORTEX',
  ecosystemIdentifier: 'TEZOS',
  tokenInstances: tokenRegistryPlugin,
  exchangeInstances: b,
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
        new ExchangeQuipuswapPlugin(quipuswapExchangeConfig),
        new ExchangeVortexPlugin(vortexExchangeConfig),
      ],
      token: tokenRegistryPlugin,
      trigger: new TriggerIntervalPlugin({ interval: 15000 }),
      reporter: new ConsoleReporterPlugin(),
      profitFinder: new ProfitFinderLitePlugin({
        profitSplitForSlippage: 0,
      }),
      keychains: [
        {
          TEZOS: {
            address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
            signer: await InMemorySigner.fromSecretKey(
              'edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq'
            ),
            rpc: tezosRpc,
          },
        },
      ],
      accountant: {} as Accountant,
    },
  } as Config;
};
export default getConfig;
