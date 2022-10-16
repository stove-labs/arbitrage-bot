import { ExchangePlugin } from './exchange/interface';
import { ExchangeIdentifier } from './exchange/types';
import { ProfitFinderPlugin } from './profit-finder/interface';
import { ReporterPlugin } from './reporter/interface';
import { TokenPlugin } from './token/interface';
import { NativeToken, Token, TokenFA12, TokenFA2 } from './token/types';
import { TriggerPlugin } from './trigger/types';

export * from './exchange/interface';
export * from './exchange/types';

export * from './profit-finder/interface';
export * from './profit-finder/types';

export * from './reporter/interface';
export * from './reporter/types';

export * from './token/interface';
export * from './token/types';

export * from './trigger/types';

export interface Balance {
  amount: string;
}

export type EcosystemIdentifier = 'TEZOS';

export interface Config {
  baseToken: Token;
  quoteToken: Token;
  plugins: {
    exchanges: ExchangePlugin[];
    token: TokenPlugin;
    trigger: TriggerPlugin;
    reporter: ReporterPlugin;
    profitFinder: ProfitFinderPlugin;
    keychains: Record<EcosystemIdentifier, any>;
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

export interface SwapResult {
  result: { type: 'OK', operation: any } | { type: 'ERROR'; data: any };
}

export interface SwapExecutionManager {
  getExchangePluginBySwap(swap: Swap): ExchangePlugin;
  executeSwaps(swaps: Swap[]): Promise<SwapResult[]>;
}

export type Address = string;
