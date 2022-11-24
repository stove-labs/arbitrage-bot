import {
  Config,
  ExchangePluginConfig,
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

import { Accountant } from '@stove-labs/arbitrage-bot-accountant';
import { TezosToolkit } from '@taquito/taquito';

import { defaultAliceSecret } from './keys/tezos/defaultKey';
import { rpc as tezosRpc } from './keys/tezos/defaultRpc';
import tokenList from './tokens/tezos/tokens';
import quipuswapExchangeRegistry from './exchanges/tezos/quipuswap';
import vortexExchangeRegistry from './exchanges/tezos/vortex';

const getConfig = async (config?: any): Promise<Config> => {
  const tezosSigner = await InMemorySigner.fromSecretKey(
    config.keys.tezos.secretKey || defaultAliceSecret
  );

  const tezosKey = {
    TEZOS: {
      address: await tezosSigner.publicKeyHash(),
      signer: tezosSigner,
      rpc: config.keys.tezos.rpc || tezosRpc,
    },
  };

  const keychains = [tezosKey];

  const tokenRegistryPlugin = new TokenRegistryPlugin(config.tokenList || tokenList);

  const quipuswapExchangeConfig: ExchangePluginConfig = {
    rpc: tezosKey.TEZOS.rpc,
    identifier: 'QUIPUSWAP',
    ecosystemIdentifier: 'TEZOS',
    tokenInstances: tokenRegistryPlugin,
    exchangeInstances: config.exchangeList.quipuswap || quipuswapExchangeRegistry,
  };

  const vortexExchangeConfig: ExchangePluginConfig = {
    rpc: tezosKey.TEZOS.rpc,
    identifier: 'VORTEX',
    ecosystemIdentifier: 'TEZOS',
    tokenInstances: tokenRegistryPlugin,
    exchangeInstances: config.exchangeList.vortex || vortexExchangeRegistry,
  };

  const exchanges: ExchangePlugin[] = [
    new ExchangeQuipuswapPlugin(quipuswapExchangeConfig),
    new ExchangeVortexPlugin(vortexExchangeConfig),
  ];

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
      trigger: new TriggerChainPlugin({ interval: config.plugins.trigger.interval || 15000 }),
      reporter: new ConsoleReporterPlugin(),
      profitFinder: new ProfitFinderLitePlugin({
        profitSplitForSlippage: 0,
      }),
      keychains,
      // Disabled until lambda views in Taquito is working consistently
      // accountant: new Accountant(
      //   { TEZOS: tezosKey.TEZOS.address },
      //   tokenRegistryPlugin,
      //   {
      //     TEZOS: new TezosToolkit(tezosKey.TEZOS.rpc),
      //   }
      // ),
      swapExecutionManager: new BatchSwapExecutionManager(exchanges, keychains),
    },
  };
};
export default getConfig;
