import {
  EcosystemIdentifier,
  ExchangePrice,
  ProfitOpportunity,
} from '../types';
import {
  NativeToken,
  Token,
  TokenDecimals,
  TokenFA12,
  TokenFA2,
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
  addTokenDecimals(prices: ExchangePrice[]): ExchangePrice[];
  addTokenInfo(profitOpportunity: ProfitOpportunity): ProfitOpportunity;
}
