import { EcosystemIdentifier, ExchangePrice } from '../types';
import {
  NativeToken,
  Token,
  TokenDecimals,
  TokenFA12,
  TokenFA2,
  TokenList,
} from './types';

export interface TokenPlugin {
  getTokenAddress(
    token: Token,
    identifier: EcosystemIdentifier
  ): string | undefined;
  getTokenInfo(
    token: Token,
    identifier: EcosystemIdentifier
    // TODO: pick one type of an array of types
  ): TokenFA12 | TokenFA2 | NativeToken | undefined;
  getTokenDecimals(prices: ExchangePrice[]): TokenDecimals;
}
