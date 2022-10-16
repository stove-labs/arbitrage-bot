import { Balance, EcosystemIdentifier, Token } from '../types';

// might change to enum down the line
export type ExchangeIdentifier = string;
export type ExchangeFee = number;

export interface ExchangePrice {
  baseToken: Token;
  baseTokenBalance: Balance;
  baseTokenDecimals?: number;
  quoteToken: Token;
  quoteTokenBalance: Balance;
  quoteTokenDecimals?: number;
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
  fee: ExchangeFee;
  spotPrice?: string;
}

export type ExchangePluginConfig = {
  rpc: string;
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
};

export type ExchangeRegistry = {
  address: string;
  identifier: ExchangeIdentifier;
  ticker1: string;
  ticker2: string;
}[];
