import { Storage } from './fa12.types';
import { tas } from '../type-aliases';

export const initStorage: Storage = {
  bridge: {
    lockSaver: tas.address('tz1LockLockLockLockLockLockLocAqQgwt'),
    outcomes: tas.bigMap([]),
    swaps: tas.bigMap([]),
  },
  token: {
    admin: tas.address(''),
    approvals: tas.bigMap([]),
    ledger: tas.bigMap([
      {
        key: tas.address('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'),
        value: tas.nat(1000000000000),
      },
    ]),
    pauseGuardian: tas.address('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'),
    paused: false,
    totalSupply: tas.nat(1000000000000),
  },
};

export const createInitialStorage = (
  admin: string,
  owner: string,
  balance: number
): Storage => {
  const storage = initStorage;
  storage.token.admin = tas.address(admin);
  storage.token.ledger = tas.bigMap([
    {
      key: tas.address(owner),
      value: tas.nat(balance),
    },
  ]);

  storage.token.totalSupply = tas.nat(balance);

  return storage;
};
