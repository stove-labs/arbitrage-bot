import { Storage } from './fa2.types';
import { tas, unit } from '../type-aliases';

export const initStorage: Storage = {
  administrators: tas.bigMap([
    {
      key: {
        owner: tas.address('tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6'),
        token_id: tas.nat(0),
      },
      value: false as unit,
    },
  ]),
  ledger: tas.bigMap([
    {
      key: {
        owner: tas.address('tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6'),
        token_id: tas.nat(0),
      },
      value: tas.nat(75942969047289680),
    },
  ]),
  operators: tas.bigMap([]),
  token_metadata: tas.bigMap([]),
  total_supply: tas.bigMap([{ key: tas.nat(0), value: tas.nat(100) }]),
};

export const createInitialStorage = (
  administrator: string,
  owner: string,
  tokenId: number,
  balance: number
): Storage => {
  const storage = initStorage;

  storage.administrators = tas.bigMap([
    {
      key: {
        owner: tas.address(administrator),
        token_id: tas.nat(tokenId),
      },
      value: false as unit,
    },
  ]);
  storage.ledger = tas.bigMap([
    {
      key: {
        owner: tas.address(owner),
        token_id: tas.nat(tokenId),
      },
      value: tas.nat(balance),
    },
  ]);

  return storage;
};
