import { ExchangePlugin } from './exchange/interface';
import { ExchangePrice } from './exchange/types';
import { ReporterPlugin } from './reporter/interface';
import { NUMBER_OF_RETRIES } from './constants';
import {
  AccountantPlugin,
  Config,
  EcosystemIdentifier,
  ProfitFinderPlugin,
  SwapExecutionManager,
  ProfitOpportunity,
  SwapResult,
  Report,
  TokenPlugin,
} from './types';

import { AccountantManager } from './accountantManager';
import { ExchangeManager } from './exchangeManager';

import { BigNumber } from 'bignumber.js';
import { Listr } from 'listr2';

export * from './types';

export class ArbitrageBotCore {
  public exchangeManager: ExchangeManager;
  public accountantManager: AccountantManager;
  public ecosystems: EcosystemIdentifier[];

  constructor(public config: Config) {}

  async start() {
    this.ecosystems = this.keychain.flatMap(
      (key) => Object.keys(key) as EcosystemIdentifier[]
    );
    this.exchangeManager = new ExchangeManager(this.exchanges, this.token);
    this.accountantManager = new AccountantManager(
      this.accountant,
      this.ecosystems,
      this.config.baseToken,
      this.config.quoteToken
    );

    // register the trigger
    this.config.plugins.trigger.register(async () => {
      // each time the trigger is triggered, run the lifecycle from scratch
      await this.startLifecycle();
    });
  }

  async startLifecycle() {
    try {
      await this.taskManager.run();
    } catch (e) {
      console.error(e);
    }
  }

  get taskManager() {
    const completeLifeCycle = async (_, task): Promise<void> => {
      // This try-catch block is here because an Error messes up the formatting
      try {
        // fetch prices from exchanges
        this.reportFetchPricesStart(task);
        this.accountingEnabled
          ? await this.accountantManager.fetchBalancesBefore()
          : {};

        const prices: ExchangePrice[] = await this.exchangeManager.fetchPrices(
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

        // restart lifecycle if swap was unsuccessful
        if (swapResults.some((swap) => swap.result.type === 'ERROR')) return;

        // report delta for baseToken and QuoteToken
        if (this.accountingEnabled) {
          this.reportArbitrageCompleteStart(task);
          await this.accountantManager.fetchBalancesAfter();
          const report = this.accountantManager.createReport();
          this.reportArbitrageCompleteEnd(task, report);
        }
      } catch (e) {
        task.output = '';
        throw e;
      }
    };

    const task = {
      task: completeLifeCycle,
      retry: NUMBER_OF_RETRIES,
    };

    return new Listr([task], {
      concurrent: false,
      exitOnError: true,
    });
  }

  reportFetchPricesStart = (task) => {
    task.title =
      this.reporter.report({
        type: 'LIFECYCLE_START',
      }) + this.reporter.report({ type: 'PRICES_FETCHED' });
  };

  reportFetchPricesEnd = (task, prices: ExchangePrice[]) => {
    task.title =
      this.reporter.report({
        type: 'LIFECYCLE_START',
      }) +
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

  reportArbitrageCompleteStart = (task) => {
    task.output = this.reporter.report({ type: 'ARBITRAGE_COMPLETE' });
  };

  reportArbitrageCompleteEnd = (task, report: Report) => {
    task.title +=
      '\n' +
      this.reporter.report({
        type: 'ARBITRAGE_COMPLETE',
        report,
      });
  };

  // returns true if there is a profit opportunity
  hasPositiveProfit = (task, profitOpportunity: ProfitOpportunity): boolean => {
    if (!BigNumber(profitOpportunity.profit.baseTokenAmount).isPositive()) {
      task.title +=
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

  get reporter(): ReporterPlugin {
    return this.config.plugins.reporter;
  }

  get token(): TokenPlugin {
    return this.config.plugins.token;
  }

  get exchanges(): ExchangePlugin[] {
    return this.config.plugins.exchanges;
  }

  get profitFinder(): ProfitFinderPlugin {
    return this.config.plugins.profitFinder;
  }

  get swapExecutionManager(): SwapExecutionManager {
    return this.config.plugins.swapExecutionManager;
  }

  get accountant(): AccountantPlugin {
    return this.config.plugins.accountant;
  }

  get keychain() {
    return this.config.plugins.keychains;
  }

  get accountingEnabled() {
    return this.accountantManager.isConfigured;
  }
}
