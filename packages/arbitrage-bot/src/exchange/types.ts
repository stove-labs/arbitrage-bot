import { Balance, Token } from "../types";

export type ExchangeIdentifier = string;
export type ExchangeFee = string;

export interface ExchangePrice {
  baseToken: Token;
  baseTokenBalance: Balance;
  quoteToken: Token;
  quoteTokenBalance: Balance;
  exchangeIdentifier: ExchangeIdentifier;
  fee: ExchangeFee;
}

export type ExchangePluginConfig = {
  rpc: string;
};
