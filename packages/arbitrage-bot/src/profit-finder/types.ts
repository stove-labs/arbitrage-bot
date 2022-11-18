import { Swap } from "../blockchain/types";

export interface Profit {
  baseTokenAmount: string;
}
export interface ProfitOpportunity {
  swaps: Swap[];
  profit: Profit;
}
