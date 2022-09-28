import { Config } from '@stove-labs/arbitrage-bot';
import { ExchangeQuipuswapPlugin } from '@stove-labs/tezos-dex-quipuswap';
import { ExchangeVortexPlugin } from '@stove-labs/tezos-dex-vortex';
import { TriggerIntervalPlugin } from '@stove-labs/arbitrage-bot-trigger-lite';
import { ConsoleReporterPlugin } from '@stove-labs/arbitrage-bot-reporter-lite';
import { ProfitFinderLitePlugin } from '@stove-labs/arbitrage-bot-profit-finder-lite';

const rpcConfig = {
    rpc: '...',
};

const tokenRegistry = [
    {
        ticker: 'XTZ',
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
        ticker: 'uUSD',
        address: 'KT1...',
        tokenId: 0,
        decimals: 6,
        ecosystemIdentifier: 'TEZOS',
    },
];

const vortexList = [
    {
        address: 'KT1LzyPS8rN375tC31WPAVHaQ4HyBvTSLwBu',
        identifier: 'Vortex',
        ticker1: 'XTZ',
        ticker2: 'SMAK',
    },
];

const quipuswapList = [
    {
        address: 'KT1Gdix8LoDoQng7YqdPNhdP5V7JRX8FqWvM',
        identifier: 'Quipuswap',
        ticker1: 'XTZ',
        ticker2: 'SMAK',
    },
];

// const addressRegistry = new AddressRegistry(tokenRegistry);

export const config: Config = {
    baseToken: {
        ticker: 'XTZ',
    },
    quoteToken: {
        ticker: 'uUSD',
    },
    plugins: {
        exchanges: [
            new ExchangeQuipuswapPlugin(rpcConfig, quipuswapList),
            new ExchangeVortexPlugin(rpcConfig, vortexList),
        ],
        trigger: new TriggerIntervalPlugin({ interval: 60000 }),
        reporter: [new ConsoleReporterPlugin()],
        profitFinder: new ProfitFinderLitePlugin(),
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
