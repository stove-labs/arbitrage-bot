import {
  Address,
  EcosystemIdentifier,
  NativeToken,
  Token,
  TokenFA12,
  TokenFA2,
  TokenList,
  TokenPlugin,
  TokenDecimals,
  ExchangePrice,
} from '@stove-labs/arbitrage-bot';
import * as constants from './constants';

export class TokenRegistryPlugin implements TokenPlugin {
  constructor(public tokenList: TokenList) {}

  /**
   *
   * @param ticker of token
   * @param identifier ecosystem eg. Tezos
   * @returns address of token contract or native token identifier or undefined if not known
   */
  getTokenAddress(
    token: Token,
    identifier: EcosystemIdentifier
  ): Address | undefined {
    const tokenInstance = this.tokenList.find(
      (value) =>
        value.ticker === token.ticker &&
        value.ecosystemIdentifier === identifier
    );

    if (!tokenInstance) return undefined;

    //@ts-ignore
    if (!tokenInstance.address) return constants.nativeTokenAddressIdentifier;
    //@ts-ignore
    return tokenInstance.address;
  }

  getTokenInfo(
    token: Token,
    identifier: EcosystemIdentifier
  ): TokenFA12 | TokenFA2 | NativeToken | undefined {
    const tokenInstance = this.tokenList.find(
      (value) =>
        value.ticker === token.ticker &&
        value.ecosystemIdentifier === identifier
    );

    if (!tokenInstance)
      throw new Error(
        `Token list doesn't have entry for token ticker: ${token.ticker} in the ecosystem: ${identifier}.`
      );

    return tokenInstance;
  }

  getTokenDecimals(prices: ExchangePrice[]): TokenDecimals {
    const baseTokenFromList = this.tokenList.find(
      (tokenListItem) => prices[0].baseToken.ticker === tokenListItem.ticker
    );
    const quoteTokenFromList = this.tokenList.find(
      (tokenListItem) => prices[0].quoteToken.ticker === tokenListItem.ticker
    );
    
    return {
      baseToken: baseTokenFromList.decimals,
      quoteToken: quoteTokenFromList.decimals,
    } as TokenDecimals;
  }

  addTokenDecimals = (
    prices: ExchangePrice[],
  ): ExchangePrice[] => {
    const tokenDecimals = this.getTokenDecimals(prices);
    
    return prices.map((exchangePrice) => {
      exchangePrice.baseTokenDecimals = tokenDecimals.baseToken;
      exchangePrice.quoteTokenDecimals = tokenDecimals.quoteToken;
      return exchangePrice;
    });
  };
}
