import { ProfitFinderPlugin } from "@stove-labs/arbitrage-bot";
import { ExchangePrice, ProfitOpportunity } from "@stove-labs/arbitrage-bot";

export class ProfitFinderLitePlugin implements ProfitFinderPlugin {
    findProfits(prices: ExchangePrice[]): ProfitOpportunity {
      // calls some internal math to find profits
      return {} as ProfitOpportunity;
    }
  }