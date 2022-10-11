
import { ContractAbstractionFromContractType, WalletContractAbstractionFromContractType } from '../type-utils';
import { address, BigMap, bytes, contract, nat, timestamp, unit } from '../type-aliases';

export type Storage = {
    bridge: {
        lockSaver: address;
        outcomes: BigMap<bytes, bytes>;
        swaps: BigMap<{
            0: bytes;
            1: address;
        }, {
            confirmed: boolean;
            fee: nat;
            from: address;
            releaseTime: timestamp;
            to: address;
            value: nat;
        }>;
    };
    token: {
        admin: address;
        approvals: BigMap<{
            0: address;
            1: address;
        }, nat>;
        ledger: BigMap<address, nat>;
        pauseGuardian: address;
        paused: boolean;
        totalSupply: nat;
    };
};

type Methods = {
    approve: (
        spender: address,
        value: nat,
    ) => Promise<void>;
    approveCAS: (
        expected: nat,
        spender: address,
        value: nat,
    ) => Promise<void>;
    burn: (
        from: address,
        value: nat,
    ) => Promise<void>;
    claimRefund: (param: bytes) => Promise<void>;
    confirmSwap: (param: bytes) => Promise<void>;
    getAllowance: (
        owner: address,
        spender: address,
        callback: contract,
    ) => Promise<void>;
    getBalance: (
        owner: address,
        callback: contract,
    ) => Promise<void>;
    getSwap: (
        secretHash: bytes,
        swapInitiator: address,
        callback: contract,
    ) => Promise<void>;
    getTotalSupply: (
        u: unit,
        callback: contract,
    ) => Promise<void>;
    lock: (
        confirmed: boolean,
        fee: nat,
        releaseTime: timestamp,
        secretHash: bytes,
        to: address,
        value: nat,
    ) => Promise<void>;
    mint: (
        to: address,
        value: nat,
    ) => Promise<void>;
    redeem: (
        secret: bytes,
        swapInitiator: address,
    ) => Promise<void>;
    setAdministrator: (param: address) => Promise<void>;
    setPause: (param: boolean) => Promise<void>;
    setPauseGuardian: (param: address) => Promise<void>;
    transfer: (
        from: address,
        to: address,
        value: nat,
    ) => Promise<void>;
};

export type MethodsObject = {
    approve: (params: {
        spender: address,
        value: nat,
    }) => Promise<void>;
    approveCAS: (params: {
        expected: nat,
        spender: address,
        value: nat,
    }) => Promise<void>;
    burn: (params: {
        from: address,
        value: nat,
    }) => Promise<void>;
    claimRefund: (param: bytes) => Promise<void>;
    confirmSwap: (param: bytes) => Promise<void>;
    getAllowance: (params: {
        owner: address,
        spender: address,
        callback: contract,
    }) => Promise<void>;
    getBalance: (params: {
        owner: address,
        callback: contract,
    }) => Promise<void>;
    getSwap: (params: {
        secretHash: bytes,
        swapInitiator: address,
        callback: contract,
    }) => Promise<void>;
    getTotalSupply: (params: {
        u: unit,
        callback: contract,
    }) => Promise<void>;
    lock: (params: {
        confirmed: boolean,
        fee: nat,
        releaseTime: timestamp,
        secretHash: bytes,
        to: address,
        value: nat,
    }) => Promise<void>;
    mint: (params: {
        to: address,
        value: nat,
    }) => Promise<void>;
    redeem: (params: {
        secret: bytes,
        swapInitiator: address,
    }) => Promise<void>;
    setAdministrator: (param: address) => Promise<void>;
    setPause: (param: boolean) => Promise<void>;
    setPauseGuardian: (param: address) => Promise<void>;
    transfer: (params: {
        from: address,
        to: address,
        value: nat,
    }) => Promise<void>;
};

type contractTypes = { methods: Methods, methodsObject: MethodsObject, storage: Storage, code: { __type: 'Fa12Code', protocol: string, code: object[] } };
export type Fa12ContractType = ContractAbstractionFromContractType<contractTypes>;
export type Fa12WalletType = WalletContractAbstractionFromContractType<contractTypes>;
