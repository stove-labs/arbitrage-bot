> This repository is related to the core library of the [arbitrage bot](../../../arbitrage-bot/).

## Learning resource

### Fetching the XTZ and token balance of the DEX

Our goal it to retrieve the `XTZ` and `token balance` from the DEX. With this information we can calculate: 
* `Spot price` by dividing one another 
* Trade amounts for a swap that takes into account the depth of liquidity (`calculateAmountOutExactIn`) 

#### Challenge

The storage structure differs for every DEX and their implementation, therefore this needs to be done case by case. 

> We can't follow the naive approach of fetching XTZ balance for a given contract address, because some of the XTZ might be reserved for future stake reward payouts!

#### Solution

We analyze the storage structure of the DEX smart contract and implement methods to retrieve the respective fields `tez_pool` and `token_pool`.

```typescript
// Quipuswap v1 storage
export type Storage = {
    storage: {
        tez_pool: nat;
        token_address: address;
        token_pool: nat;
        ...
    };
    dex_lambdas: BigMap<string, string>;
    ...
};
```

#### Implementation

```typescript
// src/exchangeQuipuswapPlugin.ts

async getContractInstance(exchangeAddress: string) {
  return await this.tezos.contract.at<QuipuswapDexTezTokenContractType>(
    exchangeAddress
  );
}

async getStorage(exchangeAddress: string) {
  const contractInstance = await this.getContractInstance(exchangeAddress);
  return contractInstance.storage();
}
```

```typescript
// fetch XTZ balance
await getStorage().storage.tez_pool.toFixed();
// fetch Token balance
await getStorage().storage.storage.token_pool.toFixed()
```

### Fetching the fee

The fee is hardcoded in `lambdas` and can't be read easily from storage. That's why we have it in `src/constants.ts`.