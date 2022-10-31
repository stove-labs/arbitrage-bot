import { SwapResult } from "@stove-labs/arbitrage-bot";

export const xtzProfitLowerThanTotalOperationCost = {
  result: {
    type: 'ERROR',
    data: 'expected XTZ profit is lower than total operation cost',
  },
} as SwapResult;
