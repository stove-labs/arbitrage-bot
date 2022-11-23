# Theory


# Implementation

The input for the profit finder algorithm is an array of two elements in the form of `ExchangePrice[]`. It is the price of the same asset pair traded on two exchanges.

```typescript
interface ExchangePrice {
  baseToken:  {
    decimals: number;
    ...
  };
  baseTokenBalance: {
    amount: string
  };
  quoteToken: {
    decimals: number;
    ...
  };
  quoteTokenBalance: {
    amount: string
  };
  fee: number;
  spotPrice: string;
  ...
}
```

The output of the profit finder are Swap parameters for both DEXs that can be processed by the [swap execution plugin](../arbitrage-bot-swap-execution/).

```typescript
interface ProfitOpportunity {
  swaps: Swap[];
  profit: {
    baseTokenAmount: string;
  };
}

interface Swap {
  tokenIn: { ticker: string };
  tokenOut: { ticker: string };
  tokenInDecimals: number;
  tokenOutDecimals: number;
  type: SwapType; // buy or sell
  amount: string;
  limit: string;
  limitWithoutSlippage: string;
  ecosystemIdentifier: EcosystemIdentifier;
  identifier: ExchangeIdentifier;
}
```


The `ProfitFinderLitePlugin` first orders the prices in an ascending order. Then it needs to find the optimal `quoteToken` amount for the trade. For that it uses the algorithm described above. The ideal `quoteToken` amount is needed for the `getAmountInGivenOut()` and `getAmountOutGivenIn()` AMM methods to calculate the parameters for the swap trades.

```typescript
class ProfitFinderLitePlugin implements ProfitFinderPlugin {
  findProfits(prices: ExchangePrice[]): ProfitOpportunity {
    throwForMissingDecimals(prices);
    const ascendingSpotPrices = orderLowToHigh(prices);
    const quoteTokenAmount = findOptimalQuoteTokenAmount(ascendingSpotPrices);

    const profitOpportunity = createProfitOpportunity(
      ascendingSpotPrices,
      quoteTokenAmount,
      this.config.profitSplitForSlippage
    );

    return profitOpportunity;
  }
  ...
}
```
