import { BigNumber } from 'bignumber.js';

export type QuipuswapStorage = {
  storage: { tez_pool: BigNumber; token_pool: BigNumber };
};

export type Balances = { baseTokenBalance: string; quoteTokenBalance: string };
