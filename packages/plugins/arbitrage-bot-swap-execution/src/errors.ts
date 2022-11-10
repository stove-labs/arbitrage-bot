import { SwapResult } from '@stove-labs/arbitrage-bot';

export const errorXtzProfitLowerThanTotalOperationCost: SwapResult = {
  result: {
    type: 'ERROR',
    data: 'expected XTZ profit is lower than total operation cost',
  },
};
