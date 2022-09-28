import {
  ExchangePlugin,
  ExchangePluginConfig,
  Token,
  ExchangePrice,
  ExchangeRegistry,
} from '@stove-labs/arbitrage-bot';
import { getExchangeAddressFromRegistry } from '@stove-labs/arbitrage-bot-exchange-utils';

import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import * as constants from './constants';
import * as errors from './errors';

type VortexStorage = {
  xtzPool: BigNumber;
  tokenPool: BigNumber;
};

export class ExchangeVortexPlugin implements ExchangePlugin {
  public identifier: 'VORTEX';
  public ecosystemIdentifier: 'TEZOS';
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

  /**
   * Only supports Vortex TEZ<->Token DEX. Returns 0 balance for Token<->Token
   */
  private getBalances(
    baseToken: Token,
    quoteToken: Token,
    storage: VortexStorage
  ): { baseTokenBalance: string; quoteTokenBalance: string } {
    let baseTokenBalance = constants.zeroBalance;
    let quoteTokenBalance = constants.zeroBalance;

    if (baseToken.ticker === 'XTZ') {
      baseTokenBalance = storage.xtzPool.toString();
      quoteTokenBalance = storage.tokenPool.toString();
    } else if (quoteToken.ticker === 'XTZ') {
      baseTokenBalance = storage.tokenPool.toString();
      quoteTokenBalance = storage.xtzPool.toString();
    }

    return {
      baseTokenBalance,
      quoteTokenBalance,
    };
  }

  private throwForUndefinedAddress(address: string | undefined): void {
    if (address === undefined) throw new Error(errors.exchangeNotFound);
  }

  /**
   * Returns the protocol fee expressed in basis points
   * eg. 0.03% (=0.003) equals 3 basis points
   */
  private get fee() {
    return constants.fee;
  }

  private async getStorage(exchangeAddress: string): Promise<VortexStorage> {
    const contractInstance = await this.getContractInstance(exchangeAddress);

    return contractInstance.storage<VortexStorage>();
  }

  private async getContractInstance(exchangeAddress: string) {
    return await this.tezos.contract.at(exchangeAddress);
  }
}
