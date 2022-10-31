import {
  Config,
  ExchangePluginConfig,
  ExchangeRegistry,
  TokenList,
} from '@stove-labs/arbitrage-bot';
import { ExchangeQuipuswapPlugin } from '@stove-labs/tezos-dex-quipuswap';
import { ExchangeVortexPlugin } from '@stove-labs/tezos-dex-vortex';
import { TriggerIntervalPlugin } from '@stove-labs/arbitrage-bot-trigger';
import { ConsoleReporterPlugin } from '@stove-labs/arbitrage-bot-reporter';
import { ProfitFinderLitePlugin } from '@stove-labs/arbitrage-bot-profit-finder-lite';
import { TokenRegistryPlugin } from '@stove-labs/arbitrage-bot-token-registry';
import { ArbitrageBotCore } from '@stove-labs/arbitrage-bot';
import { InMemorySigner } from '@taquito/signer';

describe('Quipuswap-Vortex', () => {
  it.only('can perform arbitrage between quipuswap and vortex', async () => {
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

    const exchangeConfigQuipuswap: ExchangePluginConfig = {
      rpc: 'http://127.0.0.1:8732',
      identifier: 'QUIPUSWAP',
      ecosystemIdentifier: 'TEZOS',
      tokenInstances: tokenRegistryTezos,
      exchangeInstances: quipuswapList,
    };

    const exchangeConfigVortex: ExchangePluginConfig = {
      rpc: 'http://127.0.0.1:8732',
      identifier: 'VORTEX',
      ecosystemIdentifier: 'TEZOS',
      tokenInstances: tokenRegistryTezos,
      exchangeInstances: vortexList,
    };

    const config: Config = {
      baseToken: {
        ticker: 'XTZ',
      },
      quoteToken: {
        ticker: 'kUSD',
      },
      plugins: {
        exchanges: [
          new ExchangeQuipuswapPlugin(exchangeConfigQuipuswap),
          new ExchangeVortexPlugin(exchangeConfigVortex),
        ],
        token: tokenRegistryTezos,
        trigger: new TriggerIntervalPlugin({ interval: 15000 }),
        reporter: new ConsoleReporterPlugin(),
        profitFinder: new ProfitFinderLitePlugin({
          profitSplitForSlippage: 0,
        }),
        // accountants: deal with the balances in a plugin
        // orchestrated by AccountantManager that does summing up of token balances across accountants
        // [new AccountantTezosPlugin()]
        keychains: {
          // !!! keychain is responsible for signing
          TEZOS: {
            address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
            signer: await InMemorySigner.fromSecretKey(
              'edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq'
            ),
          },
          // TEZOS: new KeychainTezosInMemoryPlugin({
          //   privateKey: "...",
          // }), // this plugin has a .sign(batchSwaps) or something...
        },
      },
    };

    const arbitrageBot = new ArbitrageBotCore(config);
    await arbitrageBot.start();
  });
});
