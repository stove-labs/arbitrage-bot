import { InMemorySigner } from '@taquito/signer';

import { ExchangePlugin } from '../exchange/interface';
import { ExchangeIdentifier } from '../exchange/types';
import { ProfitFinderPlugin } from '../profit-finder/interface';
import { ReporterPlugin } from '../reporter/interface';
import { SwapExecutionManager } from '../swap-execution/interface';
import { TokenPlugin } from '../token/interface';
import { Token } from '../token/types';
import { TriggerPlugin } from '../trigger/types';

export interface Balance {
  amount: string;
}

export type EcosystemIdentifier = 'TEZOS';

export interface TezosKey {
  address: string;
  signer: InMemorySigner;
  rpc: string;
  multiplier?: number;
}

export type EcosystemKey = TezosKey;

export interface Config {
  baseToken: Token;
  quoteToken: Token;
  plugins: {
    exchanges: ExchangePlugin[];
    token: TokenPlugin;
    trigger: TriggerPlugin;
    reporter: ReporterPlugin;
    profitFinder: ProfitFinderPlugin;
    keychains: Record<EcosystemIdentifier, EcosystemKey>[];
    swapExecutionManager: SwapExecutionManager;
  };
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
