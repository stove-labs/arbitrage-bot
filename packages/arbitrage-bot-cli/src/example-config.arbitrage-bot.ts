import { Config } from "@stove-labs/arbitrage-bot";
import { ExchangeQuipuswapPlugin } from "@stove-labs/tezos-dex-quipuswap";
import { ExchangeSpicySwapPlugin } from "@stove-labs/tezos-dex-spicyswap";
import { TriggerIntervalPlugin } from "@stove-labs/arbitrage-bot-trigger-lite";
import { ConsoleReporterPlugin } from "@stove-labs/arbitrage-bot-reporter-lite";
import { ProfitFinderLitePlugin } from "@stove-labs/arbitrage-bot-profit-finder-lite";

const rpcConfig = {
  rpc: "...",
};

export const config: Config = {
  baseToken: {
    ticker: "XTZ",
  },
  quoteToken: {
    ticker: "uUSD",
  },
  plugins: {
    exchanges: [
      new ExchangeQuipuswapPlugin(rpcConfig),
      new ExchangeSpicySwapPlugin(rpcConfig),
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
