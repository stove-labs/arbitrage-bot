import {
  Config,
  ExchangePluginConfig,
  ExchangeRegistry,
  AccountantPlugin,
  ExchangePlugin,
} from '@stove-labs/arbitrage-bot';
import { ExchangeQuipuswapPlugin } from '@stove-labs/tezos-dex-quipuswap';
import { TriggerChainPlugin } from '@stove-labs/arbitrage-bot-trigger-chain';
import { ConsoleReporterPlugin } from '@stove-labs/arbitrage-bot-reporter';
import { ProfitFinderLitePlugin } from '@stove-labs/arbitrage-bot-profit-finder-lite';
import { TokenRegistryPlugin } from '@stove-labs/arbitrage-bot-token-registry';
import { ExchangeVortexPlugin } from '@stove-labs/tezos-dex-vortex';
import { BatchSwapExecutionManager } from '@stove-labs/arbitrage-bot-swap-execution';
import { InMemorySigner } from '@taquito/signer';

import tokens from './tokens';
import quipuswapExchangeRegistry from './quipuswap';
import vortexExchangeRegistry from './vortex';

const tezosRpc = 'https://mainnet.tezos.marigold.dev';
const tokenRegistryPlugin = new TokenRegistryPlugin(tokens);

const quipuswapExchangeConfig: ExchangePluginConfig = {
  rpc: tezosRpc,
  identifier: 'QUIPUSWAP',
  ecosystemIdentifier: 'TEZOS',
  tokenInstances: tokenRegistryPlugin,
  exchangeInstances: quipuswapExchangeRegistry,
};

const vortexExchangeConfig: ExchangePluginConfig = {
  rpc: tezosRpc,
  identifier: 'VORTEX',
  ecosystemIdentifier: 'TEZOS',
  tokenInstances: tokenRegistryPlugin,
  exchangeInstances: vortexExchangeRegistry,
};

const exchanges: ExchangePlugin[] = [
  new ExchangeQuipuswapPlugin(quipuswapExchangeConfig),
  new ExchangeVortexPlugin(vortexExchangeConfig),
];

const getConfig = async (): Promise<Config> => {
  const tezosKey = {
    TEZOS: {
      address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      signer: await InMemorySigner.fromSecretKey(
        'edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq'
      ),
      rpc: tezosRpc,
    },
  };

  return {
    baseToken: {
      ticker: 'XTZ',
    },
    quoteToken: {
      ticker: 'SMAK',
    },
    plugins: {
      exchanges,
      token: tokenRegistryPlugin,
      trigger: new TriggerChainPlugin({ interval: 15000 }),
      reporter: new ConsoleReporterPlugin(),
      profitFinder: new ProfitFinderLitePlugin({
        profitSplitForSlippage: 0,
      }),
      keychains: [tezosKey],
      // accountant: {} as AccountantPlugin,
      swapExecutionManager: new BatchSwapExecutionManager(exchanges, [
        tezosKey.TEZOS,
      ]),
    },
  };
};
export default getConfig;
