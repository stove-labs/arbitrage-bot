
import { ContractAbstractionFromContractType, WalletContractAbstractionFromContractType } from '../type-utils';
import { address, BigMap, bytes, contract, lambda, MMap, nat, unit } from '../type-aliases';

export type Storage = {
    administrators: BigMap<{
        owner: address;
        token_id: nat;
    }, unit>;
    ledger: BigMap<{
        owner: address;
        token_id: nat;
    }, nat>;
    operators: BigMap<{
        owner: address;
        operator: address;
        token_id: nat;
    }, unit>;
    token_metadata: BigMap<nat, {
        token_id: nat;
        token_info: MMap<string, bytes>;
    }>;
    total_supply: BigMap<nat, nat>;
};

type Methods = {
    balance_of: (
        requests: Array<{
            owner: address;
            token_id: nat;
        }>,
        callback: contract,
    ) => Promise<void>;
    burn: (
        owner: address,
        token_id: nat,
        token_amount: nat,
    ) => Promise<void>;
    execute: (param: lambda) => Promise<void>;
    mint: (
        owner: address,
        token_id: nat,
        token_amount: nat,
    ) => Promise<void>;
    remove_administrator: (
        administrator_to_remove: address,
        token_id: nat,
    ) => Promise<void>;
    set_administrator: (
        administrator_to_set: address,
        token_id: nat,
    ) => Promise<void>;
    set_token_metadata: (
        token_id: nat,
        token_info: MMap<string, bytes>,
    ) => Promise<void>;
    transfer: (param: Array<{
            from_: address;
            txs: Array<{
                to_: address;
                token_id: nat;
                amount: nat;
            }>;
        }>) => Promise<void>;
    add_operator: (
        owner: address,
        operator: address,
        token_id: nat,
    ) => Promise<void>;
    remove_operator: (
        owner: address,
        operator: address,
        token_id: nat,
    ) => Promise<void>;
};

export type MethodsObject = {
    balance_of: (params: {
        requests: Array<{
            owner: address;
            token_id: nat;
        }>,
        callback: contract,
    }) => Promise<void>;
    burn: (params: {
        owner: address,
        token_id: nat,
        token_amount: nat,
    }) => Promise<void>;
    execute: (param: lambda) => Promise<void>;
    mint: (params: {
        owner: address,
        token_id: nat,
        token_amount: nat,
    }) => Promise<void>;
    remove_administrator: (params: {
        administrator_to_remove: address,
        token_id: nat,
    }) => Promise<void>;
    set_administrator: (params: {
        administrator_to_set: address,
        token_id: nat,
    }) => Promise<void>;
    set_token_metadata: (params: {
        token_id: nat,
        token_info: MMap<string, bytes>,
    }) => Promise<void>;
    transfer: (param: Array<{
            from_: address;
            txs: Array<{
                to_: address;
                token_id: nat;
                amount: nat;
            }>;
        }>) => Promise<void>;
    add_operator: (params: {
        owner: address,
        operator: address,
        token_id: nat,
    }) => Promise<void>;
    remove_operator: (params: {
        owner: address,
        operator: address,
        token_id: nat,
    }) => Promise<void>;
};

type contractTypes = { methods: Methods, methodsObject: MethodsObject, storage: Storage, code: { __type: 'Fa2Code', protocol: string, code: object[] } };
export type Fa2ContractType = ContractAbstractionFromContractType<contractTypes>;
export type Fa2WalletType = WalletContractAbstractionFromContractType<contractTypes>;
