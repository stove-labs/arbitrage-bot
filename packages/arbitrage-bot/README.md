# `@stove-labs/arbitrage-bot`

> TODO: description

## Usage

```
const arbitrageBot = require('@stove-labs/arbitrage-bot');

This arbitrage bot performs arbitrage between 2 exchanges. It works by defining
```
Create an arbitrage bot that speculates on the price differences between 2 or more markets. The solution must be able to trade between Basilisk and any other Kusama parachain.

An arbitrage bot takes advantage of the difference in asset prices in the market and trades for a profit. These are two arbitrage trading strategies:

A simple form of arbitrage (aka spatial arbitrage) is to trade a cryptocurrency pair at the same time on two exchanges. A trader would hold assets on both exchanges and buy crypto at a lower price on one and sell immediately at a higher price on the other.

For the bounty to be complete, you need to demonstrate an automated discovery of price discrepancies and arbitrage trading between Basilisk DEX and at least Acala or any DEX on Moonbeam. 