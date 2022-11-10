import {
  ExchangePlugin,
  ExchangePluginConfig,
  Token,
  ExchangePrice,
  Swap,
  TokenFA2,
  TokenFA12,
  EcosystemIdentifier,
} from '@stove-labs/arbitrage-bot';
import { getExchangeAddressFromRegistry } from '@stove-labs/arbitrage-bot-exchange-utils';

import {
  TezosToolkit,
  withKind,
  OpKind,
  TransferParams,
} from '@taquito/taquito';
import * as constants from './constants';
import * as errors from './errors';
import { calculateSpotPrice } from './math';
import { DexFa12ContractType } from './types/dex_fa2.types';
import { Fa12ContractType } from './types/token/fa12.types';
import { tas, timestamp } from './types/type-aliases';
import { VortexStorage } from './types/types';

export class ExchangeVortexPlugin implements ExchangePlugin {
  public identifier: string;
  public ecosystemIdentifier: EcosystemIdentifier = 'TEZOS';
  public tezos: TezosToolkit;

  constructor(public config: ExchangePluginConfig) {
    this.tezos = new TezosToolkit(config.rpc);
    this.identifier = config.identifier ? config.identifier : 'VORTEX';
  }

  async fetchPrice(
    baseToken: Token,
    quoteToken: Token
  ): Promise<ExchangePrice> {
    const exchangeAddress = getExchangeAddressFromRegistry(
      baseToken,
      quoteToken,
      this.config.exchangeInstances
    );

    // TODO: consider different error handling approach
    this.throwForUndefinedAddress(exchangeAddress);

    // fetch smart contract storage of Vortex DEX
    const storage = await this.getStorage(exchangeAddress);
    // retrieve balances
    const balances = this.getBalances(baseToken, quoteToken, storage);

    // add decimals
    const baseTokenWithInfo = this.config.tokenInstances.getTokenInfo(
      baseToken,
      this.ecosystemIdentifier
    ) as TokenFA12 | TokenFA2;
    const quoteTokenWithInfo = this.config.tokenInstances.getTokenInfo(
      quoteToken,
      this.ecosystemIdentifier
    ) as TokenFA12 | TokenFA2;

    const spotPrice = calculateSpotPrice(
      balances,
      baseTokenWithInfo,
      quoteTokenWithInfo
    );

    return {
      baseToken: baseTokenWithInfo,
      baseTokenBalance: { amount: balances.baseTokenBalance.toString() },
      quoteToken: quoteTokenWithInfo,
      quoteTokenBalance: {
        amount: balances.quoteTokenBalance.toString(),
      },
      identifier: this.identifier,
      ecosystemIdentifier: this.ecosystemIdentifier,
      fee: this.fee,
      spotPrice,
    } as unknown as ExchangePrice;
  }

  async forgeOperation(
    swap: Swap,
    botAddress: string
  ): Promise<withKind<TransferParams, OpKind.TRANSACTION>[]> {
    const address = getExchangeAddressFromRegistry(
      swap.tokenIn,
      swap.tokenOut,
      this.config.exchangeInstances
    );
    const dexContractInstance = await this.getContractInstance(address);

    // SWAP BUY XTZ -> TOKEN
    if (swap.tokenIn.ticker === 'XTZ' && swap.type === 'BUY') {
      return await this.getParamsXtzToTokenSwapBuy(
        swap.limitWithoutSlippage, // send XTZ
        swap.amount, // receive min token
        botAddress,
        dexContractInstance
      );
    }
    // SWAP SELL TOKEN -> XTZ
    else if (swap.tokenIn.ticker !== 'XTZ' && swap.type === 'SELL') {
      return await this.getParamsTokenToXtzSwapSell(
        swap.amount, // send
        swap.limit, // receive min token
        swap,
        botAddress,
        dexContractInstance
      );
    }
    // SWAP BUY TOKEN -> XTZ
    else if (swap.tokenIn.ticker !== 'XTZ' && swap.type === 'BUY') {
      return await this.getParamsTokenToXtzSwapBuy(
        swap.limitWithoutSlippage, // send token
        swap.amount, // receive min XTZ
        swap,
        botAddress,
        dexContractInstance
      );
    }
    // SWAP SELL XTZ -> TOKEN
    else if (swap.tokenIn.ticker === 'XTZ' && swap.type === 'SELL') {
      return await this.getParamsXtzToTokenSwapSell(
        swap.amount,
        swap.limit,
        botAddress,
        dexContractInstance
      );
    } else {
      throw new Error(
        `Can't forge operation for ${swap.tokenIn.ticker} and ${swap.tokenOut.ticker}. Make sure that this asset combination is supported.`
      );
    }
  }

  /**
   * Vortex doesn't support a swapType of "BUY" (getAmountInGivenOut).
   * That's why it is not possible to apply slippage on the XTZ amountIn.
   */
  getParamsXtzToTokenSwapBuy(
    amountIn: string, // this should be minAmountIn with proper smart contract support
    amountOut: string,
    recipient: string,
    dexContractInstance: DexFa12ContractType
  ) {
    return this.getParamsXtzToTokenSwap(
      amountIn,
      amountOut,
      recipient,
      dexContractInstance
    );
  }

  // basically unchanged, but we keep this for parameter annotation
  getParamsXtzToTokenSwapSell(
    amountIn: string,
    minAmountOut: string,
    recipient: string,
    dexContractInstance: DexFa12ContractType
  ) {
    return this.getParamsXtzToTokenSwap(
      amountIn,
      minAmountOut,
      recipient,
      dexContractInstance
    );
  }

  /**
   * Vortex doesn't support a swapType of "BUY" (getAmountInGivenOut).
   * That's why it is not possible to apply slippage on the token amountIn.
   */
  getParamsTokenToXtzSwapBuy(
    amountIn: string, // this should be minAmountIn with proper smart contract support
    amountOut: string,
    swap: Swap,
    recipient: string,
    dexContractInstance: DexFa12ContractType
  ) {
    return this.getParamsTokenToXtzSwap(
      amountIn,
      amountOut,
      swap,
      recipient,
      dexContractInstance
    );
  }

  // basically unchanged, but we keep this for parameter annotation
  getParamsTokenToXtzSwapSell(
    amountIn: string,
    minAmountOut: string,
    swap: Swap,
    recipient: string,
    dexContractInstance: DexFa12ContractType
  ) {
    return this.getParamsTokenToXtzSwap(
      amountIn,
      minAmountOut,
      swap,
      recipient,
      dexContractInstance
    );
  }

  private async getParamsTokenToXtzSwap(
    send: string,
    receiveMin: string,
    swap: Swap,
    recipient: string,
    dexContractInstance: DexFa12ContractType
  ): Promise<withKind<TransferParams, OpKind.TRANSACTION>[]> {
    const dexSwapTransferParams = await dexContractInstance.methods
      .tokenToXtz(
        tas.address(recipient),
        tas.nat(send),
        tas.mutez(receiveMin),
        this.getDeadlineTimestamp()
      )
      .toTransferParams();

    let tokenApproveParams: TransferParams;
    let tokenRevokeParams: TransferParams;

    if ((swap.tokenIn as TokenFA2).tokenId) {
      // with tokenId it is FA2
    } else {
      // without tokenId it is FA12
      const tokenContactAddress = (swap.tokenIn as TokenFA12).address;

      const tokenFa12Contract = await this.tezos.contract.at<Fa12ContractType>(
        tokenContactAddress
      );
      tokenApproveParams = await tokenFa12Contract.methods
        .approve(tas.address(dexContractInstance.address), tas.nat(send))
        .toTransferParams();

      tokenRevokeParams = await tokenFa12Contract.methods
        .approve(tas.address(dexContractInstance.address), tas.nat(0))
        .toTransferParams();
    }

    return [
      {
        kind: OpKind.TRANSACTION,
        ...tokenApproveParams,
      },
      {
        kind: OpKind.TRANSACTION,
        ...dexSwapTransferParams,
      },
      {
        kind: OpKind.TRANSACTION,
        ...tokenRevokeParams,
      },
    ];
  }

  private async getParamsXtzToTokenSwap(
    send: string,
    receiveMin: string,
    botAddress: string,
    dexContractInstance: DexFa12ContractType
  ): Promise<withKind<TransferParams, OpKind.TRANSACTION>[]> {
    const dexContractMethodTransferParams = await dexContractInstance.methods
      .xtzToToken(
        tas.address(botAddress),
        tas.nat(receiveMin),
        this.getDeadlineTimestamp()
      )
      .toTransferParams({
        amount: Number(send),
        mutez: true,
      });

    return [
      {
        kind: OpKind.TRANSACTION,
        ...dexContractMethodTransferParams,
      },
    ];
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
      baseTokenBalance = storage.xtzPool.toFixed();
      quoteTokenBalance = storage.tokenPool.toFixed();
    } else if (quoteToken.ticker === 'XTZ') {
      baseTokenBalance = storage.tokenPool.toFixed();
      quoteTokenBalance = storage.xtzPool.toFixed();
    }

    return {
      baseTokenBalance,
      quoteTokenBalance,
    };
  }

  private getDeadlineTimestamp() {
    // eg. offset is 40 seconds
    return new Date(
      new Date().getTime() + constants.deadlineOffset
    ).toISOString() as timestamp;
  }

  private throwForUndefinedAddress(address: string | undefined): void {
    if (address === undefined) throw new Error(errors.exchangeNotFound);
  }

  /**
   * Returns the protocol fee expressed in basis points
   * eg. 0.03% (=0.003) equals 30 basis points out of 10,000 total basis points
   */
  private get fee() {
    return constants.fee;
  }

  private async getStorage(exchangeAddress: string) {
    const contractInstance = await this.getContractInstance(exchangeAddress);

    return contractInstance.storage();
  }

  private async getContractInstance(exchangeAddress: string) {
    return await this.tezos.contract.at<DexFa12ContractType>(exchangeAddress);
  }
}
