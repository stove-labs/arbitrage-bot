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

const NUMBER_OF_RETRIES = 3;

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
    try {
      await this.tasks.run();
    } catch (e) {
      console.error(e);
    }
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

  get tasks() {
    return new Listr(
      [
        {
          task: async (_, task): Promise<void> => {
            // This try-catch block is here because Error messes up the formatting
            try {
              this.reportFetchPricesStart(task);

              const prices: ExchangePrice[] =
                await this.exchangeManager.fetchPrices(
                  this.config.baseToken,
                  this.config.quoteToken
                );

              this.reportFetchPricesEnd(task, prices);
              this.reportFindProfitOpportunityStart(task);

              const profitOpportunity: ProfitOpportunity =
                this.config.plugins.profitFinder.findProfits(prices);

              this.reportFindProfitOpportunityEnd(task, profitOpportunity);

              if (
                !this.checkIfThereIsProfitOpportunity(task, profitOpportunity)
              )
                return;

              this.reportSwapStart(task);

              const swapResults: SwapResult[] =
                await this.config.plugins.swapExecutionManager.executeSwaps(
                  profitOpportunity.swaps
                );

              this.reportSwapEnd(task, swapResults);
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
    );
  }

  startingTitle = (): string => {
    return this.reporter.report({
      type: 'LIFECYCLE_START',
    })
      ? this.reporter.report({ type: 'LIFECYCLE_START' }) + '\n'
      : '';
  };

  reportFetchPricesStart = (task) => {
    task.title =
      this.startingTitle() + this.reporter.report({ type: 'PRICES_FETCHED' });
  };

  reportFetchPricesEnd = (task, prices: ExchangePrice[]) => {
    task.title =
      this.startingTitle() +
      this.reporter.report({
        type: 'PRICES_FETCHED',
        prices,
      });
  };

  reportFindProfitOpportunityStart = (task) => {
    task.output = this.reporter.report({ type: 'PROFIT_FOUND' });
  };

  reportFindProfitOpportunityEnd = (task, profitOpportunity) => {
    task.title +=
      '\n' +
      this.reporter.report({
        type: 'PROFIT_FOUND',
        profitOpportunity,
      });
  };

  // returns true if there is profit opportunity
  checkIfThereIsProfitOpportunity = (
    task,
    profitOpportunity: ProfitOpportunity
  ): boolean => {
    if (!BigNumber(profitOpportunity.profit.baseTokenAmount).isPositive()) {
      task.title =
        this.reporter.report({
          type: 'PROFIT_FOUND',
          profitOpportunity: profitOpportunity,
        }) +
        '\n' +
        this.reporter.report({
          type: 'LIFECYCLE_END',
        });
    }

    return BigNumber(profitOpportunity.profit.baseTokenAmount).isPositive();
  };

  reportSwapStart = (task) => {
    task.output = this.reporter.report({ type: 'SWAPS_DONE' });
  };

  reportSwapEnd = (task, swapResults: SwapResult[]) => {
    task.title +=
      '\n' +
      this.reporter.report({
        type: 'SWAPS_DONE',
        swapResults,
      });
  };
}
