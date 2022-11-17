import { ExchangePlugin } from "./exchange/interface";
import { ExchangePrice } from "./exchange/types";
import { TokenPlugin } from "./token/interface";
import { Token } from "./token/types";

export class ExchangeManager {
    constructor(public exchanges: ExchangePlugin[], public token: TokenPlugin) {}
    public async fetchPrices(
      baseToken: Token,
      quoteToken: Token
    ): Promise<ExchangePrice[]> {
      const prices = await Promise.all(
        this.exchanges.map((exchange) =>
          exchange.fetchPrice(baseToken, quoteToken)
        )
      );
  
      return prices;
    }
  }