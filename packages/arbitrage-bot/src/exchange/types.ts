import {
  EcosystemIdentifier,
  Balance,
  TokenFA12,
  TokenFA2,
  TokenPlugin,
} from '../types';

// might change to enum down the line
export type ExchangeIdentifier = string;
export type ExchangeFee = number;

export interface ExchangePrice {
  baseToken: TokenFA12 | TokenFA2;
  baseTokenBalance: Balance;
  quoteToken: TokenFA12 | TokenFA2;
  quoteTokenBalance: Balance;
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
  fee: ExchangeFee;
  spotPrice?: string;
}

export type ExchangePluginConfig = {
  rpc: string;
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
  tokenInstances: TokenPlugin;
  exchangeInstances: ExchangeRegistry;
};

export type ExchangeRegistry = {
  address: string;
  identifier: ExchangeIdentifier;
  ticker1: string;
  ticker2: string;
}[];
