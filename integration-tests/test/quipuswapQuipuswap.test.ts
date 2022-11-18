import {
  Config,
  EcosystemKey,
  ExchangePluginConfig,
  ExchangeRegistry,
  TokenList,
} from '@stove-labs/arbitrage-bot';
import { ExchangeQuipuswapPlugin } from '@stove-labs/tezos-dex-quipuswap';
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

describe('Quipuswap1-Quipuswap2', () => {
  it('can perform arbitrage between quipuswap and quipuswap', async () => {
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
        identifier: 'QUIPUSWAP1',
        ticker1: 'XTZ',
        ticker2: 'kUSD',
      },
    ];

    const vortexList: ExchangeRegistry = [
      {
        address: require('../integration-tests/deployments/exchange2'),
        identifier: 'QUIPUSWAP2',
        ticker1: 'XTZ',
        ticker2: 'kUSD',
      },
    ];
    const sandboxRpc = rpcConfig.rpc;
    const exchangeConfigQuipuswap: ExchangePluginConfig = {
      rpc: sandboxRpc,
      identifier: 'QUIPUSWAP1',
      ecosystemIdentifier: 'TEZOS',
      tokenInstances: tokenRegistryTezos,
      exchangeInstances: quipuswapList,
    };

    const exchangeConfigQuipuswap2: ExchangePluginConfig = {
      rpc: sandboxRpc,
      identifier: 'QUIPUSWAP2',
      ecosystemIdentifier: 'TEZOS',
      tokenInstances: tokenRegistryTezos,
      exchangeInstances: vortexList,
    };
    const exchanges = [
      new ExchangeQuipuswapPlugin(exchangeConfigQuipuswap),
      new ExchangeQuipuswapPlugin(exchangeConfigQuipuswap2),
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
