import {
  ExchangePrice,
  ProfitOpportunity,
  SwapResult,
  SwapType,
} from '@stove-labs/arbitrage-bot';
import { expect } from 'chai';
import { ConsoleReporterPlugin } from '../src/consoleReporterPlugin';
import { Listr } from 'listr2';
import { BigNumber } from 'bignumber.js';
import { step } from 'mocha-steps';

interface Ctx {
  prices: ExchangePrice[];
  profitOpportunity: ProfitOpportunity;
  opportunityFound: boolean;
  swapResults: SwapResult[];
}

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

      const tasks = new Listr<Ctx>(
        [
          {
            title: reporter.report({ type: 'LIFECYCLE_START' }),
            task: (ctx, task): Listr =>
              task.newListr([
                {
                  title: reporter.report({ type: 'PRICES_FETCHED' }),
                  task: async (ctx, task): Promise<void> => {
                    await new Promise((f) => setTimeout(f, 3000));
                    ctx.prices = prices;

                    task.title = reporter.report({
                      type: 'PRICES_FETCHED',
                      prices: ctx.prices,
                    });
                  },
                },
                {
                  title: reporter.report({
                    type: 'PROFIT_FOUND',
                  }),
                  task: async (ctx, task): Promise<void> => {
                    await new Promise((f) => setTimeout(f, 3000));

                    ctx.profitOpportunity = profitOpportunity;
                    (task.title = reporter.report({
                      type: 'PROFIT_FOUND',
                      profitOpportunity: ctx.profitOpportunity,
                    })),
                      (ctx.opportunityFound = BigNumber(
                        ctx.profitOpportunity.profit.baseTokenAmount
                      ).isPositive());
                  },
                },
                {
                  title: reporter.report({ type: 'SWAPS_DONE' }),
                  task: async (ctx, task): Promise<void> => {
                    await new Promise((f) => setTimeout(f, 3000));
                    ctx.swapResults = swapResults;

                    task.title = reporter.report({
                      type: 'SWAPS_DONE',
                      swapResults: ctx.swapResults,
                    });
                  },
                  enabled: (ctx): boolean => ctx.opportunityFound,
                },
              ]),
          },
        ],
        { concurrent: false }
      );

      try {
        await tasks.run();
      } catch (e) {
        console.error(e);
      }
    }
  );

  step('can report on one full lifecycle where profit was found', async () => {
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
            ecosystem: 'Tezos',
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

    const tasks = new Listr<Ctx>(
      [
        {
          title: reporter.report({ type: 'LIFECYCLE_START' }),
          task: (ctx, task): Listr =>
            task.newListr((parent) => [
              {
                title: reporter.report({ type: 'PRICES_FETCHED' }),
                task: async (ctx, task): Promise<void> => {
                  await new Promise((f) => setTimeout(f, 3000));
                  ctx.prices = prices;

                  task.title = reporter.report({
                    type: 'PRICES_FETCHED',
                    prices: ctx.prices,
                  });
                },
              },
              {
                title: reporter.report({
                  type: 'PROFIT_FOUND',
                }),
                task: async (ctx, task): Promise<void> => {
                  await new Promise((f) => setTimeout(f, 3000));
                  ctx.profitOpportunity = profitOpportunity;

                  task.title = reporter.report({
                    type: 'PROFIT_FOUND',
                    profitOpportunity: ctx.profitOpportunity,
                  });
                  ctx.opportunityFound = BigNumber(
                    ctx.profitOpportunity.profit.baseTokenAmount
                  ).isPositive();
                },
              },
              {
                title: reporter.report({ type: 'SWAPS_DONE' }),
                task: async (ctx, task): Promise<void> => {
                  await new Promise((f) => setTimeout(f, 3000));
                  ctx.swapResults = swapResults;

                  task.title = reporter.report({
                    type: 'SWAPS_DONE',
                    swapResults: ctx.swapResults,
                  });

                  parent.task.title =
                    reporter.report({
                      type: 'PROFIT_FOUND',
                      profitOpportunity: ctx.profitOpportunity,
                    }) +
                    '\n' +
                    reporter.report({
                      type: 'SWAPS_DONE',
                      swapResults: ctx.swapResults,
                    });
                },
                enabled: (ctx): boolean => ctx.opportunityFound,
              },
            ]),
        },
      ],
      { concurrent: false }
    );

    try {
      await tasks.run();
    } catch (e) {
      console.error(e);
    }
  });
});
