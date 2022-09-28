import { Address, EcosystemIdentifier } from '../types';

export interface Token {
  ticker: string;
}

export interface NativeToken extends Token {
  address: string;
  decimals: number;
  ecosystemIdentifier: EcosystemIdentifier;
}

/**
 * Tezos specific ERC-20-like token contract
 * https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md
 */
export interface TokenFA12 extends Token {
  address: Address;
  decimals: number;
  ecosystemIdentifier: EcosystemIdentifier;
}

/**
 * Tezos specific ERC-1155-like token contract
 * https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md
 */
export interface TokenFA2 extends Token {
  address: Address;
  tokenId: number;
  decimals: number;
  ecosystemIdentifier: EcosystemIdentifier;
}

export type TokenList = Array<NativeToken | TokenFA12 | TokenFA2>;

export type TokenDecimals = {
  baseToken: number;
  quoteToken: number;
};
