# Theory

In the process of arbitrage a trader speculates on the price differences between two markets, by taking advantage of the difference in asset prices and trades for a profit. The strategy is to buy crypto at a lower price on one exchange and sell immediately at a higher price on the other.

* **Base token** is the token we want to accumulate over time through arbitrage trades. We need to have a balance of this token to start trading. It is used in the first swap/trade.
* **Quote token** is the token we trade against in an arbitrage life-cycle. We don't need to have a balance of this token, because we will receive it from the first swap. Subsequently, we try to sell the total output from the first trade in the second swap for the base token.
* **Profit** is the difference between `base token` balance before and after the arbitrage life-cycle.
* **Life cycle** of the arbitrage consists of the `buy` and `sell` swap. It completes when both swaps/trades have been finalized.

An arbitrage opportunity presents itself when the same asset pair is traded on two different exchanges with varying prices. Of course we need to take into account fees as well, because those will cut into the profit opportunity.

|             | DEX1                        | DEX2                         |
|-------------|-----------------------------|------------------------------|
| base token  | **low price in base token** | **high price in base token** |
| quote token | high price in quote token   | low price in quote token     |

#### Swap strategy

|             | DEX1 | DEX2 |
|-------------|------|------|
| base token  | buy  | sell |
| quote token |      |      |

#### Flow of tokens

The profit is the difference between the base token send (1) and receive (4).

|             | DEX1        | DEX2        |
|-------------|-------------|-------------|
| base token  | (1) send    | (4) receive |
| quote token | (2) receive | (3) send    |

#### Objective is to find the parameters of the swap (amounts and limits)

Challenge is to find the optimal amount x, in order to calculate the required base token limits.

|             | DEX1                  | DEX2                  |
|-------------|-----------------------|-----------------------|
| base token  | getAmountInGivenOut() | getAmountOutGivenIn() |
| quote token | optimal amount x      | amount amount x       |

#### Balances of DEX denoted as a1, b1, a2, b2

|             | DEX1 | DEX2 |
|-------------|------|------|
| base token  | a1   | a2   |
| quote token | b1   | b2   |

#### Finding the optimal quote token amount x

The following formulas are simplified for 0.3% fee (=1-997/1000). The final algorithm uses parameterized fees for each exchange independently.

```math
getAmountInGivenOut=\frac{amountOut*1000*reserveIn}{reserveOut*1000-amountOut*997}
```

```math
getAmountOutGivenIn=\frac{amountIn*997*reserveOut}{reserveIn*1000+amountIn*997}
```


|             | DEX1 | DEX2 |
|-------------|------|------|
| base token  | Δa1  | Δa2  |
| quote token | x    | x    |

```math
\Delta a_1 = getAmountInGivenOut(x) = \frac{x*1000*a_1}{b_1*1000-x*f_1}
```

```math
\Delta a_2 = getAmountOutGivenIn(x) = \frac{x*f_2*a_2}{b_2*1000+x*f_2}
```

Finally our profit function is:

```math
f(x)=\Delta a_2 - \Delta a_1 = \frac{x*f_2*a_2}{b_2*1000+x*f_2} - \frac{x*1000*a_1}{b_1*1000-x*f_1}
```
And we want to find the biggest amount of x, where x < b1 and x < b2 (can't trade more quote tokens than there is in the pool).

We set the first derivative of this function to zero. Solving that yields us x1 and x2.
```math
\frac{\delta}{\delta x}f(x)=f'(x)=0
```
Rearranging the function to fit the univariate quadratic function
```math
f'(x)= ax^2 + bx + c = 0
```
Allows us to extract the coefficients and solve it with this formula

```math
x_{1,2}=-\frac{b±\sqrt{b²-4ac}}{2a}
```

This is an example where base token is XTZ (y-axis) and quote token kUSD (x-axis). The optimal solution for quote token amount is x=23 kUSD that gives us a profit of 0.057 XTZ. Any other value would extract less arbitrage through the two trades.
<img width="367" alt="image" src="https://user-images.githubusercontent.com/8685779/203608922-58cb339e-f556-4072-96f1-ce21c079b650.png">



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
