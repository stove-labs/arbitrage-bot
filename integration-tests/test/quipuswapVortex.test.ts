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
  it('can perform arbitrage between quipuswap and vortex', async () => {
    const exchangeConfigQuipuswap: ExchangePluginConfig = {
      rpc: 'http://127.0.0.1:8732',
      identifier: 'QUIPUSWAP',
      ecosystemIdentifier: 'TEZOS',
    };

    const exchangeConfigVortex: ExchangePluginConfig = {
      rpc: 'http://127.0.0.1:8732',
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
        address: require('../integration-tests/deployments/tokenFA12'),
        decimals: 12,
        ecosystemIdentifier: 'TEZOS',
      },
    ];

    const quipuswapList: ExchangeRegistry = [
      {
        address: require('../integration-tests/deployments/exchange1'),
        identifier: 'QUIPUSWAP',
        ticker1: 'XTZ',
        ticker2: 'SMAK',
      },
    ];

    const vortexList: ExchangeRegistry = [
      {
        address: require('../integration-tests/deployments/vortexExchange'),
        identifier: 'VORTEX',
        ticker1: 'XTZ',
        ticker2: 'SMAK',
      },
    ];

    const tokenRegistry = new TokenRegistryPlugin(tokenList);

    const config: Config = {
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
        trigger: new TriggerIntervalPlugin({ interval: 10000 }),
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
