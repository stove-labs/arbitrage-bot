> This repository is related to the core library of the [arbitrage bot](../../arbitrage-bot/).

The accountant is a plugin that retrieves balances for any given native or token contract. This is used to keep track of balance changes before and after arbitrage is performed.

## Learning resource

### Challenge

Every token contract follows its own implementation of a token standard. Therefore it is not a viable approach to read the account ballance entry from a ledger `Big_map`, because we would need to be aware of each and every token implementation.

### Solution

Tezos token FA1.2 [TZIP-7](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md) and FA2[TZIP-12](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md) have on-chain [`view entrypoints`](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints) that usually get called by other smart contracts to get the `total_supply` of `token_balance` for a given account address. The result is returned through an operation as callback to the caller. 

Fortunately, recent protocol upgrades on Tezos have provided a way to call those `view entrypoints` through the node without the need of injecting any on-chain operation when using the `run_view` endpoint. `Taquito SDK` abstracts this and makes this feature easily available to dApp developers.

### Implementation

```typescript
// src/accountant.ts

// FA1.2 getBalance as defined in TZIP-7
await tokenContractInstance.views.getBalance(botAddress).read()

// FA2 balance_of as defined in TZIP-12
await tokenContractInstance.views.balance_of(
  [
    { owner: botAddress, token_id: tokenId },
  ]
).read()
```