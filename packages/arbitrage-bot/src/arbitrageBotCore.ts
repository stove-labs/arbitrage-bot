import { ExchangePlugin } from './exchange/interface';
import { ExchangePrice } from './exchange/types';
import { ReporterPlugin } from './reporter/interface';
import { Config, Token } from './types';

import { BatchSwapExecutionManager } from '@stove-labs/arbitrage-bot-swap-execution';

export * from './types';

class ExchangeManager {
  constructor(public exchanges: ExchangePlugin[]) {}
  public async fetchPrices(
    baseToken: Token,
    quoteToken: Token
  ): Promise<ExchangePrice[]> {
    // fetch prices / liquidity
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
  public swapExecutionManager: BatchSwapExecutionManager;

  constructor(public config: Config) {}

  async startLifecycle() {
    // balance at the start baseToken / quoteToken
    const balance = {};

    this.reporter.report({ type: 'LIFECYCLE_START' });
    const prices = await this.exchangeManager.fetchPrices(
      this.config.baseToken,
      this.config.quoteToken
    );
    this.reporter.report({ type: 'PRICES_FETCHED', prices });
    const profitOpportunity =
      this.config.plugins.profitFinder.findProfits(prices);
    this.reporter.report({ type: 'PROFIT_FOUND', profitOpportunity });
    // profitOpportunity.swaps -> SwapExecutionManager -> group swaps by ecosystemIdentifier
    // Exchange.forgeTransaction(swap)
    const swapResults = await this.swapExecutionManager.executeSwaps(
      profitOpportunity.swaps
    );
    // report if the execution of the opportunity swap was executed
    this.reporter.report({ type: 'SWAPS_DONE', swapResults });

    // balance after swaps were executed (after arbitrage attempt)
    const balanceAfterArbitrage = {};
    // baseToken: old balance -> new balance
    // quoteToken: old balance -> new balance
    // report the difference between indicated profit from swaps and the real balance delta
    this.reporter.report({
      type: 'ARBITRAGE_COMPLETE',
      payload: { balance, balanceAfterArbitrage, profitOpportunity },
    });
  }

  get reporter(): ReporterPlugin {
    // TODO
    return this.config.plugins.reporter[0];
  }

  start() {
    this.exchangeManager = new ExchangeManager(this.config.plugins.exchanges);
    this.swapExecutionManager = new BatchSwapExecutionManager(
      this.config.plugins.exchanges,
      this.config.plugins.keychains
    );

    // register the trigger
    this.config.plugins.trigger.register(async () => {
      // each time the trigger is triggered, run the lifecycle from scratch
      await this.startLifecycle();
    });
  }
}
