import {
  ContractAbstractionFromContractType,
  WalletContractAbstractionFromContractType,
} from './type-utils';
import {
  address,
  BigMap,
  key_hash,
  mutez,
  nat,
  timestamp,
  unit,
} from './type-aliases';

type Storage = {
  tokenPool: nat;
  xtzPool: mutez;
  lqtTotal: nat;
  selfIsUpdatingTokenPool: boolean;
  freezeBaker: boolean;
  manager: address;
  tokenAddress: address;
  lqtAddress: address;
  history: BigMap<string, nat>;
  user_investments: BigMap<
    address,
    {
      direction: { aDD: unit } | { rEMOVE: unit };
      token: nat;
      xtz: mutez;
    }
  >;
  reserve: address;
};

type Methods = {
  addLiquidity: (
    owner: address,
    minLqtMinted: nat,
    maxTokensDeposited: nat,
    deadline: timestamp
  ) => Promise<void>;
  default: () => Promise<void>;
  removeLiquidity: (
    to: address,
    lqtBurned: nat,
    minXtzWithdrawn: mutez,
    minTokensWithdrawn: nat,
    deadline: timestamp
  ) => Promise<void>;
  setBaker: (freezeBaker: boolean, baker?: key_hash) => Promise<void>;
  setLqtAddress: (param: address) => Promise<void>;
  setManager: (param: address) => Promise<void>;
  tokenToToken: (
    outputDexterContract: address,
    minTokensBought: nat,
    to: address,
    tokensSold: nat,
    deadline: timestamp
  ) => Promise<void>;
  tokenToXtz: (
    to: address,
    tokensSold: nat,
    minXtzBought: mutez,
    deadline: timestamp
  ) => Promise<void>;
  updateReserve: (param: address) => Promise<void>;
  updateTokenPool: () => Promise<void>;
  updateTokenPoolInternal: (param: nat) => Promise<void>;
  xtzToToken: (
    to: address,
    minTokensBought: nat,
    deadline: timestamp
  ) => Promise<void>;
};

type MethodsObject = {
  addLiquidity: (params: {
    owner: address;
    minLqtMinted: nat;
    maxTokensDeposited: nat;
    deadline: timestamp;
  }) => Promise<void>;
  default: () => Promise<void>;
  removeLiquidity: (params: {
    to: address;
    lqtBurned: nat;
    minXtzWithdrawn: mutez;
    minTokensWithdrawn: nat;
    deadline: timestamp;
  }) => Promise<void>;
  setBaker: (params: {
    baker?: key_hash;
    freezeBaker: boolean;
  }) => Promise<void>;
  setLqtAddress: (param: address) => Promise<void>;
  setManager: (param: address) => Promise<void>;
  tokenToToken: (params: {
    outputDexterContract: address;
    minTokensBought: nat;
    to: address;
    tokensSold: nat;
    deadline: timestamp;
  }) => Promise<void>;
  tokenToXtz: (params: {
    to: address;
    tokensSold: nat;
    minXtzBought: mutez;
    deadline: timestamp;
  }) => Promise<void>;
  updateReserve: (param: address) => Promise<void>;
  updateTokenPool: () => Promise<void>;
  updateTokenPoolInternal: (param: nat) => Promise<void>;
  xtzToToken: (params: {
    to: address;
    minTokensBought: nat;
    deadline: timestamp;
  }) => Promise<void>;
};

type contractTypes = {
  methods: Methods;
  methodsObject: MethodsObject;
  storage: Storage;
  code: { __type: 'DexFa12Code'; protocol: string; code: object[] };
};
export type DexFa12ContractType =
  ContractAbstractionFromContractType<contractTypes>;
export type DexFa12WalletType =
  WalletContractAbstractionFromContractType<contractTypes>;
