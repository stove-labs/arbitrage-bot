import { Storage } from './vortex-dex-tez-token.types';
import { tas } from './type-aliases';

export const initStorage: Storage = {
  tokenPool: tas.nat(0),
  xtzPool: tas.mutez(0),
  lqtTotal: tas.nat(0),
  selfIsUpdatingTokenPool: true,
  freezeBaker: true,
  history: tas.bigMap([]),
  lqtAddress: tas.address('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'),
  manager: tas.address('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'),
  reserve: tas.address('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'),
  tokenAddress: tas.address('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'),
  user_investments: tas.bigMap([]),
};

export const createStorage = (
  tokenPoolBalance: number,
  xtzPoolBalance: number,
  tokenAddress: string
): Storage => {
  const storage = initStorage;
  storage.tokenPool = tas.nat(tokenPoolBalance);
  storage.xtzPool = tas.mutez(xtzPoolBalance);
  storage.tokenAddress = tas.address(tokenAddress);

  return storage;
};
