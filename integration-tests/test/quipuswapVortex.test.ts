import {
  Config,
  EcosystemKey,
  ExchangePluginConfig,
  ExchangeRegistry,
  TokenList,
} from '@stove-labs/arbitrage-bot';
import { ExchangeQuipuswapPlugin } from '@stove-labs/tezos-dex-quipuswap';
import { ExchangeVortexPlugin } from '@stove-labs/tezos-dex-vortex';
import { ConsoleReporterPlugin } from '@stove-labs/arbitrage-bot-reporter';
import { ProfitFinderLitePlugin } from '@stove-labs/arbitrage-bot-profit-finder-lite';
import { TokenRegistryPlugin } from '@stove-labs/arbitrage-bot-token-registry';
import { ArbitrageBotCore } from '@stove-labs/arbitrage-bot';
import { TriggerChainPlugin } from '@stove-labs/arbitrage-bot-trigger-chain';
import { InMemorySigner } from '@taquito/signer';
import { BatchSwapExecutionManager } from '@stove-labs/arbitrage-bot-swap-execution';
import { Accountant } from '@stove-labs/arbitrage-bot-accountant';

import rpcConfig from '../config';

import { TezosToolkit } from '@taquito/taquito';

describe('Quipuswap-Vortex', () => {
  it('can perform arbitrage between quipuswap and vortex', async () => {
    const tokenListTezos: TokenList = [
      {
        ticker: 'XTZ',
        address: 'native',
        decimals: 6,
        ecosystemIdentifier: 'TEZOS',
      },
      {
        ticker: 'kUSD',
        address: require('../integration-tests/deployments/tokenFA12'),
        decimals: 18,
        ecosystemIdentifier: 'TEZOS',
      },
    ];
    const tokenRegistryTezos = new TokenRegistryPlugin(tokenListTezos);
    const quipuswapList: ExchangeRegistry = [
      {
        address: require('../integration-tests/deployments/exchange1'),
        identifier: 'QUIPUSWAP',
        ticker1: 'XTZ',
        ticker2: 'kUSD',
      },
    ];

    const vortexList: ExchangeRegistry = [
      {
        address: require('../integration-tests/deployments/vortexExchange'),
        identifier: 'VORTEX',
        ticker1: 'XTZ',
        ticker2: 'kUSD',
      },
    ];
    const sandboxRpc = rpcConfig.rpc;
    const exchangeConfigQuipuswap: ExchangePluginConfig = {
      rpc: sandboxRpc,
      identifier: 'QUIPUSWAP',
      ecosystemIdentifier: 'TEZOS',
      tokenInstances: tokenRegistryTezos,
      exchangeInstances: quipuswapList,
    };

    const exchangeConfigVortex: ExchangePluginConfig = {
      rpc: sandboxRpc,
      identifier: 'VORTEX',
      ecosystemIdentifier: 'TEZOS',
      tokenInstances: tokenRegistryTezos,
      exchangeInstances: vortexList,
    };
    const exchanges = [
      new ExchangeQuipuswapPlugin(exchangeConfigQuipuswap),
      new ExchangeVortexPlugin(exchangeConfigVortex),
    ];

    const botAddress = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';
    const tezosKey: EcosystemKey = {
      address: botAddress,
      signer: await InMemorySigner.fromSecretKey(
        'edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq'
      ),
      rpc: sandboxRpc,
    };
    const config: Config = {
      baseToken: {
        ticker: 'XTZ',
      },
      quoteToken: {
        ticker: 'kUSD',
      },
      plugins: {
        exchanges,
        token: tokenRegistryTezos,
        trigger: new TriggerChainPlugin({ interval: 15000 }),
        reporter: new ConsoleReporterPlugin(),
        profitFinder: new ProfitFinderLitePlugin({
          profitSplitForSlippage: 0,
        }),
        keychains: [{ TEZOS: tezosKey }],
        accountant: new Accountant({ TEZOS: botAddress }, tokenRegistryTezos, {
          TEZOS: new TezosToolkit(sandboxRpc),
        }),
        swapExecutionManager: new BatchSwapExecutionManager(exchanges, [
          { TEZOS: tezosKey },
        ]),
      },
    };

    const arbitrageBot = new ArbitrageBotCore(config);
    await arbitrageBot.start();
  });
});
