import { BigNumber } from 'bignumber.js';

export type Balances = { baseTokenBalance: string; quoteTokenBalance: string };
export type VortexStorage = {
  xtzPool: BigNumber;
  tokenPool: BigNumber;
};
