> This repository is related to the core library of the [arbitrage bot](../../arbitrage-bot/).

## Learning resource

### Challenge

The most straightforward approach would be to subscribe to new blocks of a blockchain and use that as trigger for the lifecycle. However, this increases complexity and reduces control over the flow if blockchains with various block times are targeted and centralized exchanges come into play.
Another approach would be a simple `setTimeout` to a predefined time-interval/delay at which the lifcycle is triggered. Also this is not viable, because it interrupt pending operations in case those take longer than the time-interval/delay.

### Solution

This trigger builds on top of a time based `delay` (defined in milliseconds), by extending it with a *debounce* and *schedule* functionality. It basically chains lifecycles, but waits with the callback as long as the user defined `delay`.

### Implementation

Review `src/triggerChainPlugin.ts` for a detailed overview.