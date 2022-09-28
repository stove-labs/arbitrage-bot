import {
  ExchangePlugin,
  ExchangePluginConfig,
  Token,
  ExchangePrice,
  ExchangeRegistry,
  EcosystemIdentifier,
} from '@stove-labs/arbitrage-bot';
import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import * as constants from './constants';
import * as errors from './errors';
import { getExchangeAddressFromRegistry } from '@stove-labs/arbitrage-bot-exchange-utils';

type QuipuswapStorage = {
  storage: { tez_pool: BigNumber; token_pool: BigNumber };
};

export class ExchangeQuipuswapPlugin implements ExchangePlugin {
  public identifier = 'QUIPUSWAP';
  public ecosystemIdentifier: EcosystemIdentifier = 'TEZOS';
  public tezos: TezosToolkit;

  constructor(
    public config: ExchangePluginConfig,
    public instances: ExchangeRegistry
  ) {
    this.tezos = new TezosToolkit(config.rpc);
  }

  async fetchPrice(
    baseToken: Token,
    quoteToken: Token
  ): Promise<ExchangePrice> {
    const exchangeAddress = getExchangeAddressFromRegistry(
      baseToken,
      quoteToken,
      this.instances
    );
    // TODO: consider different error handling approach
    this.throwForUndefinedAddress(exchangeAddress);

    // fetch smart contract storage of Quipuswap DEX
    const storage = await this.getStorage(exchangeAddress);
    // retrieve balances
    const balances = this.getBalances(baseToken, quoteToken, storage);

    return {
      baseToken,
      baseTokenBalance: { amount: balances.baseTokenBalance.toString() },
      quoteToken,
      quoteTokenBalance: {
        amount: balances.quoteTokenBalance.toString(),
      },
      exchangeIdentifier: this.identifier,
      fee: this.fee,
    } as ExchangePrice;
  }

  private throwForUndefinedAddress(address: string | undefined): void {
    if (address === undefined) throw new Error(errors.exchangeNotFound);
  }

  /**
   * Only supports Quipuswap TEZ<->Token DEX. Returns 0 balance for Token<->Token
   */
  private getBalances(
    baseToken: Token,
    quoteToken: Token,
    storage: QuipuswapStorage
  ): { baseTokenBalance: string; quoteTokenBalance: string } {
    let baseTokenBalance = constants.zeroBalance;
    let quoteTokenBalance = constants.zeroBalance;

    if (baseToken.ticker === 'XTZ') {
      baseTokenBalance = storage.storage.tez_pool.toString();
      quoteTokenBalance = storage.storage.token_pool.toString();
    } else if (quoteToken.ticker === 'XTZ') {
      baseTokenBalance = storage.storage.token_pool.toString();
      quoteTokenBalance = storage.storage.tez_pool.toString();
    }

    return {
      baseTokenBalance,
      quoteTokenBalance,
    };
  }

  /**
   * Returns the liquidity provider fee expressed in basis points
   * eg. 0.03% (=0.003) equals 3 basis points
   */
  private get fee() {
    // TODO: read fee from smart contract (hardcoded in lambdas)
    return constants.fee;
  }

  private async getStorage(exchangeAddress: string): Promise<QuipuswapStorage> {
    const contractInstance = await this.getContractInstance(exchangeAddress);

    return contractInstance.storage<QuipuswapStorage>();
  }

  private async getContractInstance(exchangeAddress: string) {
    return await this.tezos.contract.at(exchangeAddress);
  }
}
