
import { ContractAbstractionFromContractType, WalletContractAbstractionFromContractType } from './type-utils';
import { address, BigMap, bytes, MMap, mutez, nat, unit } from './type-aliases';

export type Storage = {
    counter: nat;
    default_metadata: BigMap<string, bytes>;
    default_reserve: address;
    default_token_metadata: BigMap<nat, {
        token_id: nat;
        token_info: MMap<string, bytes>;
    }>;
    empty_allowances: BigMap<{
        owner: address;
        spender: address;
    }, nat>;
    empty_history: BigMap<string, nat>;
    empty_tokens: BigMap<address, nat>;
    empty_user_investments: BigMap<address, {
        direction: (
            { aDD: unit }
            | { rEMOVE: unit }
        );
        token: nat;
        xtz: mutez;
    }>;
    swaps: BigMap<nat, address>;
    token_to_swaps: BigMap<address, address>;
};

type Methods = {
    launchExchange: (
        token_address: address,
        token_amount: nat,
    ) => Promise<void>;
    setLqtAddress: (
        dex_address: address,
        lqt_address: address,
    ) => Promise<void>;
};

type MethodsObject = {
    launchExchange: (params: {
        token_address: address,
        token_amount: nat,
    }) => Promise<void>;
    setLqtAddress: (params: {
        dex_address: address,
        lqt_address: address,
    }) => Promise<void>;
};

type contractTypes = { methods: Methods, methodsObject: MethodsObject, storage: Storage, code: { __type: 'FactoryFa12Code', protocol: string, code: object[] } };
export type FactoryFa12ContractType = ContractAbstractionFromContractType<contractTypes>;
export type FactoryFa12WalletType = WalletContractAbstractionFromContractType<contractTypes>;
