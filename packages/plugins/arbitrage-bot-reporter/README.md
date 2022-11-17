# `@stove-labs/arbitrage-bot-reporter`

This plugin is low-level package for reporting events in cli using [listr2](https://github.com/cenk1cenk2/listr2).
## Usage

```ts
import { ConsoleReporterPlugin } from '../src/consoleReporterPlugin';
import { Listr } from 'listr2';

const reporter = new ConsoleReporterPlugin();

new Listr(
  [
    {
      task: async (_, task): Promise<void> => {
        // This try-catch block is here because an Error messes up the formatting
        try {
          // fetch prices from exchanges
          reportFetchPricesStart(task);
          const prices = await exchangeManager.fetchPrices(
            baseToken,
            quoteToken
          );
          reportFetchPricesEnd(task, prices);

          // find arbitrage, calculate profit opportunity
          reportFindProfitOpportunityStart(task);
          const profitOpportunity: ProfitOpportunity =
            plugins.profitFinder.findProfits(prices);
          reportFindProfitOpportunityEnd(task, profitOpportunity);
          // restart lifecycle if no profit was found
          if (!hasPositiveProfit(task, profitOpportunity)) return;

          // execute swaps for arbitrage
          reportSwapStart(task);
          const swapResults: SwapResult[] =
            await plugins.swapExecutionManager.executeSwaps(
              profitOpportunity.swaps
            );
          reportSwapEnd(task, swapResults);
        } catch (e) {
          task.output = '';
          throw e;
        }
      },
      retry: NUMBER_OF_RETRIES,
    },
  ],
  {
    concurrent: false,
    exitOnError: true,
  }
).run();

const reportFetchPricesStart = (task) => {
  task.title =
    reporter.report({
      type: 'LIFECYCLE_START',
    }) + reporter.report({ type: 'PRICES_FETCHED' });
};

const reportFetchPricesEnd = (task, prices: ExchangePrice[]) => {
  task.title =
    reporter.report({
      type: 'LIFECYCLE_START',
    }) +
    reporter.report({
      type: 'PRICES_FETCHED',
      prices,
    });
};

const reportFindProfitOpportunityStart = (task) => {
  task.output = reporter.report({ type: 'PROFIT_FOUND' });
};

const reportFindProfitOpportunityEnd = (task, profitOpportunity) => {
  task.title +=
    '\n' +
    reporter.report({
      type: 'PROFIT_FOUND',
      profitOpportunity,
    });
};

const reportSwapStart = (task) => {
  task.output = reporter.report({ type: 'SWAPS_DONE' });
};

const reportSwapEnd = (task, swapResults: SwapResult[]) => {
  task.title +=
    '\n' +
    reporter.report({
      type: 'SWAPS_DONE',
      swapResults,
    });
};
```
