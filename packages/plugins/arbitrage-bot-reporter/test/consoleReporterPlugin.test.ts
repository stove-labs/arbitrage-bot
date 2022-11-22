import {
  ExchangePrice,
  ProfitOpportunity,
  Report,
  SwapResult,
  SwapType,
} from '@stove-labs/arbitrage-bot';
import { expect } from 'chai';
import { ConsoleReporterPlugin } from '../src/consoleReporterPlugin';
import { Listr } from 'listr2';
import { BigNumber } from 'bignumber.js';
import { step } from 'mocha-steps';

const reporter = new ConsoleReporterPlugin();

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

const checkIfThereIsProfitOpportunity = (
  task,
  profitOpportunity: ProfitOpportunity
): boolean => {
  if (!BigNumber(profitOpportunity.profit.baseTokenAmount).isPositive()) {
    task.title +=
      '\n' +
      reporter.report({
        type: 'LIFECYCLE_END',
      });
  }

  return BigNumber(profitOpportunity.profit.baseTokenAmount).isPositive();
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

const reportArbitrageCompleteStart = (task) => {
  task.output = reporter.report({ type: 'ARBITRAGE_COMPLETE' });
};

const reportArbitrageCompleteEnd = (task, report: Report) => {
  task.title +=
    '\n' +
    reporter.report({
      type: 'ARBITRAGE_COMPLETE',
      report,
    });
};

const tasks = (
  prices,
  profitOpportunity,
  swapResults,
  report,
  error = false
) => {
  return new Listr(
    [
      {
        task: async (_, task): Promise<void> => {
          // This try-catch block is here because an Error messes up the formatting
          try {
            // fetch prices from exchanges
            reportFetchPricesStart(task);
            await new Promise((f) => setTimeout(f, 3000));
            reportFetchPricesEnd(task, prices);

            // find arbitrage, calculate profit opportunity
            reportFindProfitOpportunityStart(task);
            await new Promise((f) => setTimeout(f, 3000));
            reportFindProfitOpportunityEnd(task, profitOpportunity);

            // restart lifecycle if no profit was found
            if (!checkIfThereIsProfitOpportunity(task, profitOpportunity)) {
              return;
            }

            if (error) {
              const retry = task.isRetrying();
              if (retry && !(retry.count > 0)) {
                throw new Error('No profit opportunity detected');
              }
            }

            // execute swaps for arbitrage
            reportSwapStart(task);
            await new Promise((f) => setTimeout(f, 3000));
            reportSwapEnd(task, swapResults);

            if (swapResults.some((swap) => swap.result.type === 'ERROR')) return;

            reportArbitrageCompleteStart(task);
            await new Promise((f) => setTimeout(f, 3000));
            reportArbitrageCompleteEnd(task, report);
          } catch (e) {
            task.output = '';
            throw e;
          }
        },
        retry: 3,
      },
    ],
    {
      concurrent: false,
      exitOnError: true,
    }
  );
};

describe('consoleReporterPlugin', () => {
  let reporter: ConsoleReporterPlugin;

  beforeEach(() => {
    reporter = new ConsoleReporterPlugin();
  });

  step(
    'can report on one full lifecycle where NO profit was found',
    async () => {
      const prices: ExchangePrice[] = [
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '14940270938' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '16013485687542328761467' },
          identifier: 'VORTEX',
          ecosystemIdentifier: 'TEZOS',
          fee: 28,
          spotPrice: '932980',
        },
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '149603497766' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '160299740742899133256578' },
          identifier: 'QUIPUSWAP',
          ecosystemIdentifier: 'TEZOS',
          fee: 30,
          spotPrice: '933273',
        },
      ];

      const profitOpportunity: ProfitOpportunity = {
        swaps: [
          {
            amount: '0',
            limit: '1',
            limitWithoutSlippage: '1',
            tokenIn: { ticker: 'XTZ' },
            tokenInDecimals: 6,
            tokenOutDecimals: 18,
            tokenOut: { ticker: 'kUSD' },
            type: SwapType.BUY,
            identifier: 'VORTEX',
            ecosystemIdentifier: 'TEZOS',
          },
          {
            amount: '0',
            limit: '0',
            limitWithoutSlippage: '0',
            tokenIn: { ticker: 'kUSD' },
            tokenInDecimals: 18,
            tokenOutDecimals: 6,
            tokenOut: { ticker: 'XTZ' },
            type: SwapType.SELL,
            identifier: 'QUIPUSWAP',
            ecosystemIdentifier: 'TEZOS',
          },
        ],
        profit: { baseTokenAmount: '-1' },
      };
      const swapResults: SwapResult[] = [];
      const report: Report = {
        baseToken: {
          ticker: 'XTZ',
          decimals: 6,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        baseTokenDelta: '5324',
        quoteToken: {
          ticker: 'kUSD',
          decimals: 18,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        quoteTokenDelta: '21321413415324',
      };

      try {
        await tasks(prices, profitOpportunity, swapResults, report).run();
      } catch (e) {
        console.error(e);
      }
    }
  );

  step(
    'can report on one full lifecycle where profit was found with native token profit',
    async () => {
      const prices: ExchangePrice[] = [
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '145416563245' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1VSuDnQqktrmJNS1TBxzvGwRFd7TGgVhgC',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '198676450055331726699899' },
          identifier: 'QUIPUSWAP',
          ecosystemIdentifier: 'TEZOS',
          fee: 30,
          spotPrice: '731926',
        },
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '14223194732' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1VSuDnQqktrmJNS1TBxzvGwRFd7TGgVhgC',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '19272019166664506280072' },
          identifier: 'VORTEX',
          ecosystemIdentifier: 'TEZOS',
          fee: 28,
          spotPrice: '738023',
        },
      ];

      const profitOpportunity: ProfitOpportunity = {
        swaps: [
          {
            amount: '21908525265582003606',
            limit: '16085456',
            limitWithoutSlippage: '16085456',
            tokenIn: { ticker: 'XTZ' },
            tokenInDecimals: 6,
            tokenOutDecimals: 18,
            tokenOut: { ticker: 'kUSD' },
            type: SwapType.BUY,
            identifier: 'QUIPUSWAP',
            ecosystemIdentifier: 'TEZOS',
          },
          {
            amount: '21908525265582003606',
            limit: '16105466',
            limitWithoutSlippage: '16105466',
            tokenIn: { ticker: 'kUSD' },
            tokenInDecimals: 18,
            tokenOutDecimals: 6,
            tokenOut: { ticker: 'XTZ' },
            type: SwapType.SELL,
            identifier: 'VORTEX',
            ecosystemIdentifier: 'TEZOS',
          },
        ],
        profit: { baseTokenAmount: '20010' },
      };
      const swapResults: SwapResult[] = [
        {
          result: {
            type: 'OK',
            operation: {
              ecosystem: 'TEZOS',
              exchanges: ['Quipuswap', 'Vortex'], //string[] not necessarily more than 1 exchange
              operationHash: 'hashhashhash',
              profit: { amount: '23443', decimals: '6' },
              totalOperationCost: '3030', //string
              baseToken: { ticker: 'XTZ' },
              quoteToken: { ticker: 'kUSD' },
            },
          },
        },
      ];
      const report: Report = {
        baseToken: {
          ticker: 'XTZ',
          decimals: 6,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        baseTokenDelta: '5324',
        quoteToken: {
          ticker: 'kUSD',
          decimals: 18,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        quoteTokenDelta: '21321413415324',
      };

      try {
        await tasks(prices, profitOpportunity, swapResults, report).run();
      } catch (e) {
        console.error(e);
      }
    }
  );

  step(
    'can report on one full lifecycle where profit was found with native token profit and with one retry',
    async () => {
      const prices: ExchangePrice[] = [
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '145416563245' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1VSuDnQqktrmJNS1TBxzvGwRFd7TGgVhgC',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '198676450055331726699899' },
          identifier: 'QUIPUSWAP',
          ecosystemIdentifier: 'TEZOS',
          fee: 30,
          spotPrice: '731926',
        },
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '14223194732' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1VSuDnQqktrmJNS1TBxzvGwRFd7TGgVhgC',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '19272019166664506280072' },
          identifier: 'VORTEX',
          ecosystemIdentifier: 'TEZOS',
          fee: 28,
          spotPrice: '738023',
        },
      ];

      const profitOpportunity: ProfitOpportunity = {
        swaps: [
          {
            amount: '21908525265582003606',
            limit: '16085456',
            limitWithoutSlippage: '16085456',
            tokenIn: { ticker: 'XTZ' },
            tokenInDecimals: 6,
            tokenOutDecimals: 18,
            tokenOut: { ticker: 'kUSD' },
            type: SwapType.BUY,
            identifier: 'QUIPUSWAP',
            ecosystemIdentifier: 'TEZOS',
          },
          {
            amount: '21908525265582003606',
            limit: '16105466',
            limitWithoutSlippage: '16105466',
            tokenIn: { ticker: 'kUSD' },
            tokenInDecimals: 18,
            tokenOutDecimals: 6,
            tokenOut: { ticker: 'XTZ' },
            type: SwapType.SELL,
            identifier: 'VORTEX',
            ecosystemIdentifier: 'TEZOS',
          },
        ],
        profit: { baseTokenAmount: '20010' },
      };
      const swapResults: SwapResult[] = [
        {
          result: {
            type: 'OK',
            operation: {
              ecosystem: 'TEZOS',
              exchanges: ['Quipuswap', 'Vortex'], //string[] not necessarily more than 1 exchange
              operationHash: 'hashhashhash',
              profit: { amount: '23443', decimals: '6' },
              totalOperationCost: '3030', //string
              baseToken: { ticker: 'XTZ' },
              quoteToken: { ticker: 'kUSD' },
            },
          },
        },
      ];
      const report: Report = {
        baseToken: {
          ticker: 'XTZ',
          decimals: 6,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        baseTokenDelta: '5324',
        quoteToken: {
          ticker: 'kUSD',
          decimals: 18,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        quoteTokenDelta: '21321413415324',
      };

      try {
        await tasks(prices, profitOpportunity, swapResults, report, true).run();
      } catch (e) {
        console.error(e);
      }
    }
  );

  step(
    'can report on one full lifecycle where profit was found with non-native token profit',
    async () => {
      const prices: ExchangePrice[] = [
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '145416563245' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1VSuDnQqktrmJNS1TBxzvGwRFd7TGgVhgC',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '198676450055331726699899' },
          identifier: 'QUIPUSWAP',
          ecosystemIdentifier: 'TEZOS',
          fee: 30,
          spotPrice: '731926',
        },
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '14223194732' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1VSuDnQqktrmJNS1TBxzvGwRFd7TGgVhgC',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '19272019166664506280072' },
          identifier: 'VORTEX',
          ecosystemIdentifier: 'TEZOS',
          fee: 28,
          spotPrice: '738023',
        },
      ];

      const profitOpportunity: ProfitOpportunity = {
        swaps: [
          {
            amount: '21908525265582003606',
            limit: '16085456',
            limitWithoutSlippage: '16085456',
            tokenIn: { ticker: 'XTZ' },
            tokenInDecimals: 6,
            tokenOutDecimals: 18,
            tokenOut: { ticker: 'kUSD' },
            type: SwapType.BUY,
            identifier: 'QUIPUSWAP',
            ecosystemIdentifier: 'TEZOS',
          },
          {
            amount: '21908525265582003606',
            limit: '16105466',
            limitWithoutSlippage: '16105466',
            tokenIn: { ticker: 'kUSD' },
            tokenInDecimals: 18,
            tokenOutDecimals: 6,
            tokenOut: { ticker: 'XTZ' },
            type: SwapType.SELL,
            identifier: 'VORTEX',
            ecosystemIdentifier: 'TEZOS',
          },
        ],
        profit: { baseTokenAmount: '20010' },
      };
      const swapResults: SwapResult[] = [
        {
          result: {
            type: 'OK',
            operation: {
              ecosystem: 'TEZOS',
              exchanges: ['Quipuswap', 'Vortex'], //string[] not necessarily more than 1 exchange
              operationHash: 'hashhashhash',
              profit: { amount: '23443', decimals: '6' },
              totalOperationCost: '3030', //string
              baseToken: { ticker: 'kUSD' },
              quoteToken: { ticker: 'kBTC' },
            },
          },
        },
      ];
      const report: Report = {
        baseToken: {
          ticker: 'XTZ',
          decimals: 6,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        baseTokenDelta: '5324',
        quoteToken: {
          ticker: 'kUSD',
          decimals: 18,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        quoteTokenDelta: '21321413415324',
      };

      try {
        await tasks(prices, profitOpportunity, swapResults, report).run();
      } catch (e) {
        console.error(e);
      }
    }
  );

  step(
    'can report on one full lifecycle where profit was found but swap ended in error',
    async () => {
      const prices: ExchangePrice[] = [
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '145416563245' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1VSuDnQqktrmJNS1TBxzvGwRFd7TGgVhgC',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '198676450055331726699899' },
          identifier: 'QUIPUSWAP',
          ecosystemIdentifier: 'TEZOS',
          fee: 30,
          spotPrice: '731926',
        },
        {
          baseToken: {
            ticker: 'XTZ',
            address: 'native',
            decimals: 6,
            ecosystemIdentifier: 'TEZOS',
          },
          baseTokenBalance: { amount: '14223194732' },
          quoteToken: {
            ticker: 'kUSD',
            address: 'KT1VSuDnQqktrmJNS1TBxzvGwRFd7TGgVhgC',
            decimals: 18,
            ecosystemIdentifier: 'TEZOS',
          },
          quoteTokenBalance: { amount: '19272019166664506280072' },
          identifier: 'VORTEX',
          ecosystemIdentifier: 'TEZOS',
          fee: 28,
          spotPrice: '738023',
        },
      ];

      const profitOpportunity: ProfitOpportunity = {
        swaps: [
          {
            amount: '21908525265582003606',
            limit: '16085456',
            limitWithoutSlippage: '16085456',
            tokenIn: { ticker: 'XTZ' },
            tokenInDecimals: 6,
            tokenOutDecimals: 18,
            tokenOut: { ticker: 'kUSD' },
            type: SwapType.BUY,
            identifier: 'QUIPUSWAP',
            ecosystemIdentifier: 'TEZOS',
          },
          {
            amount: '21908525265582003606',
            limit: '16105466',
            limitWithoutSlippage: '16105466',
            tokenIn: { ticker: 'kUSD' },
            tokenInDecimals: 18,
            tokenOutDecimals: 6,
            tokenOut: { ticker: 'XTZ' },
            type: SwapType.SELL,
            identifier: 'VORTEX',
            ecosystemIdentifier: 'TEZOS',
          },
        ],
        profit: { baseTokenAmount: '20010' },
      };
      const swapResults: SwapResult[] = [
        {
          result: {
            type: 'ERROR',
            data: 'expected XTZ profit is lower than total operation cost',
          },
        },
      ];
      const report: Report = {
        baseToken: {
          ticker: 'XTZ',
          decimals: 6,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        baseTokenDelta: '5324',
        quoteToken: {
          ticker: 'kUSD',
          decimals: 18,
          ecosystemIdentifier: 'TEZOS',
          address: '0',
        },
        quoteTokenDelta: '21321413415324',
      };

      try {
        await tasks(prices, profitOpportunity, swapResults, report).run();
      } catch (e) {
        console.error(e);
      }
    }
  );
});
