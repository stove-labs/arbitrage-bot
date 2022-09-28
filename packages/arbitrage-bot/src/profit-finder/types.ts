import { Swap } from '../types';

export interface Profit {
  baseTokenAmount: string;
}
export interface ProfitOpportunity {
  swaps: Swap[];
  profit: Profit;
}
