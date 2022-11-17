import { ExchangePlugin } from './exchange/interface';
import { ExchangePrice } from './exchange/types';
import { ReporterPlugin } from './reporter/interface';
import { Config, ProfitOpportunity, SwapResult, TokenPlugin } from './types';
import { BigNumber } from 'bignumber.js';
import { Listr } from 'listr2';
import { ExchangeManager } from './exchangeManager';
import { NUMBER_OF_RETRIES } from './constants';

export * from './types';

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

  async start() {
    this.exchangeManager = new ExchangeManager(this.exchanges, this.token);

    // register the trigger
    this.config.plugins.trigger.register(async () => {
      // each time the trigger is triggered, run the lifecycle from scratch
      await this.startLifecycle();
    });
  }

  get tasks() {
    const tasks = {
      task: async (_, task): Promise<void> => {
        // This try-catch block is here because Error messes up the formatting
        try {
          // fetch prices from exchanges
          this.reportFetchPricesStart(task);
          const prices: ExchangePrice[] =
            await this.exchangeManager.fetchPrices(
              this.config.baseToken,
              this.config.quoteToken
            );
          this.reportFetchPricesEnd(task, prices);

          // find arbitrage, calculate profit opportunity
          this.reportFindProfitOpportunityStart(task);
          const profitOpportunity: ProfitOpportunity =
            this.config.plugins.profitFinder.findProfits(prices);
          this.reportFindProfitOpportunityEnd(task, profitOpportunity);
          // restart lifecycle if no profit was found
          if (!this.hasPositiveProfit(task, profitOpportunity)) return;

          // execute swaps for arbitrage
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
    };

    return new Listr([tasks], {
      concurrent: false,
      exitOnError: true,
    });
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
  hasPositiveProfit = (task, profitOpportunity: ProfitOpportunity): boolean => {
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

  get reporter(): ReporterPlugin {
    return this.config.plugins.reporter;
  }

  get token(): TokenPlugin {
    return this.config.plugins.token;
  }

  get exchanges(): ExchangePlugin[] {
    return this.config.plugins.exchanges;
  }
}
