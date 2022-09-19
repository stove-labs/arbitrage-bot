import { ExchangePrice } from "../exchange/types";
import { ProfitOpportunity } from "./types";

export interface ProfitFinderPlugin {
    findProfits(prices: ExchangePrice[]): ProfitOpportunity;
  }
  