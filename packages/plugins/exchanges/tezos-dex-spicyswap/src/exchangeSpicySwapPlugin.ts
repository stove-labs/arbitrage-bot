import {
  ExchangePlugin,
  ExchangePluginConfig,
} from "@stove-labs/arbitrage-bot";
import {
  Token,
  ExchangePrice,
  ExchangeFee,
} from "@stove-labs/arbitrage-bot";

export class ExchangeSpicySwapPlugin implements ExchangePlugin {
  public identifier: "SPICYSWAP";
  public ecosystemIdentifier: "TEZOS";

  constructor(public config: ExchangePluginConfig) {}

  fetchPrice(baseToken: Token, quoteToken: Token): ExchangePrice {
    return {} as ExchangePrice;
  }
  getFee(baseToken: Token, quoteToken: Token): ExchangeFee {
    return "";
  }
}
