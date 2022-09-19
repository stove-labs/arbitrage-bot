import { Swap } from "../types";

export interface Profit {
  baseTokenBalance: string;
}
export interface ProfitOpportunity {
  swaps: Swap[];
  profit: Profit;
}

