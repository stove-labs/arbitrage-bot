import { ExchangePlugin } from './exchange/interface';
import { ExchangePrice } from './exchange/types';
import { ReporterPlugin } from './reporter/interface';
import {
  AccountantPlugin,
  Config,
  EcosystemIdentifier,
  ProfitFinderPlugin,
  SwapExecutionManager,
  Token,
  TokenPlugin,
} from './types';
import { BigNumber } from 'bignumber.js';
import { AccountantManager } from './accountantManager';

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
  public accountantManager: AccountantManager;
  public ecosystems: EcosystemIdentifier[];

  constructor(public config: Config) {}

  async startLifecycle() {
    this.reporter.report({ type: 'LIFECYCLE_START' });
    await this.accountantManager.fetchBalancesBefore();
    
    const prices = await this.exchangeManager.fetchPrices(
      this.config.baseToken,
      this.config.quoteToken
    );

    this.reporter.report({ type: 'PRICES_FETCHED', prices });

    const profitOpportunity = this.profitFinder.findProfits(prices);

    this.reporter.report({ type: 'PROFIT_FOUND', profitOpportunity });

    if (BigNumber(profitOpportunity.profit.baseTokenAmount).isNegative())
      return;

    const swapResults = await this.swapExecutionManager.executeSwaps(
      profitOpportunity.swaps
    );
    this.reporter.report({ type: 'SWAPS_DONE', swapResults });

    await this.accountantManager.fetchBalancesAfter();
    this.reporter.report({
      type: 'ARBITRAGE_COMPLETE',
      payload: this.accountantManager.createReport(),
    });
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
}
