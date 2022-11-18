import { InMemorySigner } from '@taquito/signer';
import { EcosystemIdentifier } from '../ecosystem/types';
import { ExchangeIdentifier } from '../exchange/types';
import { NativeToken, Token, TokenFA12, TokenFA2 } from '../token/types';

export interface Balance {
  amount: string;
  token?: TokenFA12 | TokenFA2 | NativeToken;
}

export interface TezosKey {
  address: string;
  signer: InMemorySigner;
  rpc: string;
  multiplier?: number;
}

export enum SwapType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface Swap {
  tokenIn: Token;
  tokenOut: Token;
  tokenInDecimals: number;
  tokenOutDecimals: number;
  type: SwapType;
  amount: string;
  limit: string;
  limitWithoutSlippage: string;
  ecosystemIdentifier: EcosystemIdentifier;
  identifier: ExchangeIdentifier;
}

export type Address = string;
