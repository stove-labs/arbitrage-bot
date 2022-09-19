import {
  ExchangePlugin,
  ExchangePluginConfig,
  Token,
  ExchangePrice,
  ExchangeFee,
} from "@stove-labs/arbitrage-bot";

export class ExchangeQuipuswapPlugin implements ExchangePlugin {
  public identifier: "QUIPUSWAP";
  public ecosystemIdentifier: "TEZOS";

  constructor(public config: ExchangePluginConfig) {}

  fetchPrice(baseToken: Token, quoteToken: Token): ExchangePrice {
    return {} as ExchangePrice;
  }
  getFee(baseToken: Token, quoteToken: Token): ExchangeFee {
    return "";
  }
}
