
import { ContractAbstractionFromContractType, WalletContractAbstractionFromContractType } from '../type-utils';
import { address, BigMap, bytes, contract, key_hash, MMap, nat, timestamp } from '../type-aliases';

export type Storage = {
    dex_lambdas: BigMap<string, string>;
    metadata: BigMap<string, bytes>;
    storage: {
        baker_validator: address;
        current_candidate?: key_hash;
        current_delegated?: key_hash;
        last_update_time: timestamp;
        last_veto: timestamp;
        ledger: BigMap<address, {
            allowances: MMap<address, nat>;
            balance: nat;
            frozen_balance: nat;
        }>;
        period_finish: timestamp;
        reward: nat;
        reward_paid: nat;
        reward_per_sec: nat;
        reward_per_share: nat;
        tez_pool: nat;
        token_address: address;
        token_pool: nat;
        total_reward: nat;
        total_supply: nat;
        total_votes: nat;
        user_rewards: BigMap<address, {
            reward: nat;
            reward_paid: nat;
        }>;
        veto: nat;
        vetos: BigMap<key_hash, timestamp>;
        voters: BigMap<address, {
            candidate?: key_hash;
            last_veto: timestamp;
            veto: nat;
            vote: nat;
        }>;
        votes: BigMap<key_hash, nat>;
    };
    token_lambdas: BigMap<nat, string>;
};

type Methods = {
    approve: (
        spender: address,
        value: nat,
    ) => Promise<void>;
    default: () => Promise<void>;
    getAllowance: (
        owner: address,
        spender: address,
        _2: contract,
    ) => Promise<void>;
    getBalance: (
        owner: address,
        _1: contract,
    ) => Promise<void>;
    getReserves: (param: contract) => Promise<void>;
    getTotalSupply: (
        _0: contract,
    ) => Promise<void>;
    transfer: (
        from: address,
        to: address,
        value: nat,
    ) => Promise<void>;
    divestLiquidity: (
        min_tez: nat,
        min_tokens: nat,
        shares: nat,
    ) => Promise<void>;
    initializeExchange: (param: nat) => Promise<void>;
    investLiquidity: (param: nat) => Promise<void>;
    tezToTokenPayment: (
        min_out: nat,
        receiver: address,
    ) => Promise<void>;
    tokenToTezPayment: (
        amount: nat,
        min_out: nat,
        receiver: address,
    ) => Promise<void>;
    veto: (
        value: nat,
        voter: address,
    ) => Promise<void>;
    vote: (
        candidate: key_hash,
        value: nat,
        voter: address,
    ) => Promise<void>;
    withdrawProfit: (param: address) => Promise<void>;
};

type MethodsObject = {
    approve: (params: {
        spender: address,
        value: nat,
    }) => Promise<void>;
    default: () => Promise<void>;
    getAllowance: (params: {
        owner: address,
        spender: address,
        2: contract,
    }) => Promise<void>;
    getBalance: (params: {
        owner: address,
        1: contract,
    }) => Promise<void>;
    getReserves: (param: contract) => Promise<void>;
    getTotalSupply: (params: {
        0: contract,
    }) => Promise<void>;
    transfer: (params: {
        from: address,
        to: address,
        value: nat,
    }) => Promise<void>;
    divestLiquidity: (params: {
        min_tez: nat,
        min_tokens: nat,
        shares: nat,
    }) => Promise<void>;
    initializeExchange: (param: nat) => Promise<void>;
    investLiquidity: (param: nat) => Promise<void>;
    tezToTokenPayment: (params: {
        min_out: nat,
        receiver: address,
    }) => Promise<void>;
    tokenToTezPayment: (params: {
        amount: nat,
        min_out: nat,
        receiver: address,
    }) => Promise<void>;
    veto: (params: {
        value: nat,
        voter: address,
    }) => Promise<void>;
    vote: (params: {
        candidate: key_hash,
        value: nat,
        voter: address,
    }) => Promise<void>;
    withdrawProfit: (param: address) => Promise<void>;
};

type contractTypes = { methods: Methods, methodsObject: MethodsObject, storage: Storage, code: { __type: 'QuipuswapDexTezTokenCode', protocol: string, code: object[] } };
export type QuipuswapDexTezTokenContractType = ContractAbstractionFromContractType<contractTypes>;
export type QuipuswapDexTezTokenWalletType = WalletContractAbstractionFromContractType<contractTypes>;
