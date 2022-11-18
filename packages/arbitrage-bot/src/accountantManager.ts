import { AccountantPlugin } from './accountant/interface';
import { Balance, EcosystemIdentifier, Token } from './types';
import { BigNumber } from 'bignumber.js';

type AccountantBalances = {
  before: { base: Balance; quote: Balance };
  after: { base: Balance; quote: Balance };
};

export class AccountantManager {
  public balances: Partial<AccountantBalances>;

  constructor(
    public accountant: AccountantPlugin,
    public ecosystems: EcosystemIdentifier[],
    public baseToken: Token,
    public quoteToken: Token
  ) {}
  async fetchAllBalances() {
    for (const ecosystem of this.ecosystems) {
      return {
        base: await this.accountant.getBalance(this.baseToken, ecosystem),
        quote: await this.accountant.getBalance(this.quoteToken, ecosystem),
      };
    }
  }
  async fetchBalancesBefore() {
    this.balances = { before: await this.fetchAllBalances() };
  }
  async fetchBalancesAfter() {
    this.balances = { ...this.balances, after: await this.fetchAllBalances() };
  }

  // TODO: check on undefined properties
  createReport() {
    const baseTokenDelta = new BigNumber(this.balances.after.base.amount)
      .minus(this.balances.before.base.amount)
      .toFixed();
    const quoteTokenDelta = new BigNumber(this.balances.after.quote.amount)
      .minus(this.balances.before.quote.amount)
      .toFixed();

    return {
      baseTokenDelta,
      baseToken: this.balances.after.base.token,
      quoteTokenDelta,
      quoteToken: this.balances.after.quote.token,
    };
  }
}
