# Arbitrage Bot Swap Execution Plugin

> This repository is related to the core library of the [arbitrage bot](../../arbitrage-bot/).

The swap execution plugin is responsible to group swaps transactions and token approvals wherever possible in batches. For example in Tezos, when operations are grouped with the `batch` call, they are executed `atomically`. That means that if one operation fails, the whole stack fails and reverts. This is especially handy for arbitrage done completely on Tezos, because it poses a risk free approach if the net profit condition is not met.

## Dependency

We use the TypeScript/JavaScript SDK `@taquito/taquito` to interact with the Tezos node.

## Learning resource

```typescript
// this is a typical batch operation if arbitrage is done between 2 DEXs on Tezos
const batchParameters = [
    xtzToTokenExchange1, // swap 1
    approveTokenSpendingExchange2,
    tokenToXtzExchange2, // swap 2
    revokeTokenSpendingExchange2
]
```

```typescript
// src/swapExecution.ts

// retrieve all operation parameters and save in the batchParameters array
for await (const operationParameters of swaps.map((swap) =>
            this.getExchangePluginBySwap(swap).forgeOperation(
            swap,
            botAddress
            )
        )) {
            batchParameters = [...batchParameters, ...operationParameters];
        }
```

⚠️ It is important to note that arbitrage is a competitive field and many other bots could go for the same arbitrage opportunity. The node operator (usually) orders operations by baker fee. However, for batch operations only the operation fee of the first operation is taken into account. That's why the `totalEstOpCost * multiplier` is applied to the first operation *only* of the batch. Leaving the fee for all the other operations would be a waste.

```typescript
// src/handleTezosSwapExecution.ts

// estimate operation cost for the batch operation
const estimates = await tezos.estimate.batch(batchParameters);
const totalEstOpCost = estimates.reduce(
    (sum, current) => sum + current.suggestedFeeMutez,
    0
);

let multiplier = ecosystemKey.multiplier || 1;

// increase operation cost/fee if necessary to stay competitive in regards to other swaps in the block
// (inflated) fee is only applied to the first operation in the batch!
batchParameters[0].fee = new BigNumber(totalEstOpCost * multiplier)
    .integerValue()
    .toNumber();
```