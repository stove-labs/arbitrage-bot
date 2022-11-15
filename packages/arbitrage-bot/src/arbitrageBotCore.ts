import { ExchangePlugin } from './exchange/interface';
import { ExchangePrice } from './exchange/types';
import { ReporterPlugin } from './reporter/interface';
import {
  Config,
  ProfitOpportunity,
  SwapResult,
  Token,
  TokenPlugin,
} from './types';
import { BigNumber } from 'bignumber.js';
import { Listr } from 'listr2';

export * from './types';

class ExchangeManager {
  constructor(public exchanges: ExchangePlugin[], public token: TokenPlugin) {}
  public async fetchPrices(
    baseToken: Token,
    quoteToken: Token
  ): Promise<ExchangePrice[]> {
    const prices = await Promise.all(
      this.exchanges.map((exchange) =>
        exchange.fetchPrice(baseToken, quoteToken)
      )
    );

    return prices;
  }
}

export class ArbitrageBotCore {
  public exchangeManager: ExchangeManager;

  constructor(public config: Config) {}

  async startLifecycle() {
    interface Ctx {
      prices: ExchangePrice[];
      profitOpportunity: ProfitOpportunity;
      opportunityFound: boolean;
      swapResults: SwapResult[];
    }

    const tasks = new Listr<Ctx>(
      [
        {
          title: this.reporter.report({ type: 'LIFECYCLE_START' }),
          task: (ctx, task): Listr =>
            task.newListr((parent) => [
              {
                title: this.reporter.report({ type: 'PRICES_FETCHED' }),
                task: async (ctx, task): Promise<void> => {
                  ctx.prices = await this.exchangeManager.fetchPrices(
                    this.config.baseToken,
                    this.config.quoteToken
                  );

                  task.title = this.reporter.report({
                    type: 'PRICES_FETCHED',
                    prices: ctx.prices,
                  });
                },
              },
              {
                title: this.reporter.report({
                  type: 'PROFIT_FOUND',
                }),
                task: async (ctx, task): Promise<void> => {
                  ctx.profitOpportunity =
                    this.config.plugins.profitFinder.findProfits(ctx.prices);

                  task.title = this.reporter.report({
                    type: 'PROFIT_FOUND',
                    profitOpportunity: ctx.profitOpportunity,
                  });
                  ctx.opportunityFound = BigNumber(
                    ctx.profitOpportunity.profit.baseTokenAmount
                  ).isPositive();
                  if (!ctx.opportunityFound) {
                    parent.task.title =
                      this.reporter.report({
                        type: 'PROFIT_FOUND',
                        profitOpportunity: ctx.profitOpportunity,
                      }) +
                      '\n' +
                      this.reporter.report({
                        type: 'LIFECYCLE_END',
                      });
                  }
                },
              },
              {
                title: this.reporter.report({ type: 'SWAPS_DONE' }),
                task: async (ctx, task): Promise<void> => {
                  ctx.swapResults =
                    await this.config.plugins.swapExecutionManager.executeSwaps(
                      ctx.profitOpportunity.swaps
                    );

                  task.title = this.reporter.report({
                    type: 'SWAPS_DONE',
                    swapResults: ctx.swapResults,
                  });

                  parent.task.title =
                    this.reporter.report({
                      type: 'PROFIT_FOUND',
                      profitOpportunity: ctx.profitOpportunity,
                    }) +
                    '\n' +
                    this.reporter.report({
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
    // // balance at the start baseToken / quoteToken
    // const balance = {};

    // this.reporter.report({ type: 'LIFECYCLE_START' });
    // const prices = await this.exchangeManager.fetchPrices(
    //   this.config.baseToken,
    //   this.config.quoteToken
    // );

    // this.reporter.report({ type: 'PRICES_FETCHED', prices });

    // const profitOpportunity =
    //   this.config.plugins.profitFinder.findProfits(prices);

    // this.reporter.report({ type: 'PROFIT_FOUND', profitOpportunity });

    // if (BigNumber(profitOpportunity.profit.baseTokenAmount).isNegative())
    //   return;

    // const swapResults =
    //   await this.config.plugins.swapExecutionManager.executeSwaps(
    //     profitOpportunity.swaps
    //   );
    // // report if the execution of the opportunity swap was executed
    // this.reporter.report({ type: 'SWAPS_DONE', swapResults });

    // // balance after swaps were executed (after arbitrage attempt)
    // const balanceAfterArbitrage = {};
    // // baseToken: old balance -> new balance
    // // quoteToken: old balance -> new balance
    // // report the difference between indicated profit from swaps and the real balance delta
    // this.reporter.report({
    //   type: 'ARBITRAGE_COMPLETE',
    //   payload: { balance, balanceAfterArbitrage, profitOpportunity },
    // });
  }

  get reporter(): ReporterPlugin {
    return this.config.plugins.reporter;
  }

  get token(): TokenPlugin {
    return this.config.plugins.token;
  }

  get exchanges(): ExchangePlugin[] {
    return this.config.plugins.exchanges;
  }

  async start() {
    this.exchangeManager = new ExchangeManager(this.exchanges, this.token);

    // register the trigger
    this.config.plugins.trigger.register(async () => {
      // each time the trigger is triggered, run the lifecycle from scratch
      await this.startLifecycle();
    });
  }
}
