import { ExchangePlugin } from "./exchange/interface";
import { ProfitFinderPlugin } from "./profit-finder/interface";
import { ReporterPlugin } from "./reporter/interface";
import { TriggerPlugin } from "./trigger/types";

export * from "./exchange/interface";
export * from "./exchange/types";

export * from "./profit-finder/interface";
export * from "./profit-finder/types";

export * from "./reporter/interface";
export * from "./reporter/types";

export * from "./trigger/types";

export interface Token {
  ticker: string;
}

export interface TokenFA12 extends Token {
  address: Address;
  decimals: number;
  ecosystemIdentifier: EcosystemIdentifier;
}

export interface TokenFA2 extends Token {
  address: Address;
  tokenId: number;
  decimals: number;
  ecosystemIdentifier: EcosystemIdentifier;
}

export interface Balance {
  amount: string;
}

export type EcosystemIdentifier = "TEZOS";

export interface Config {
  baseToken: Token;
  quoteToken: Token;
  plugins: {
    exchanges: ExchangePlugin[];
    trigger: TriggerPlugin;
    reporter: ReporterPlugin[];
    profitFinder: ProfitFinderPlugin;
    keychains: Record<EcosystemIdentifier, any>;
  };
}

export interface Swap {
  tokenIn: string;
  type: "buy" | "sell";
  // ...
}

export interface SwapResult {
  result: { type: "OK" } | { type: "ERROR"; data: any };
}

export interface SwapExecutionManager {
  getExchangePluginBySwap(swap: Swap): ExchangePlugin;
  executeSwaps(swaps: Swap[]): Promise<SwapResult[]>;
}

type Address = string;

export type TokenList = Array<TokenFA12 | TokenFA2>;

export interface TokenRegistry {
  getTokenAddress(
    ticker: Token["ticker"],
    identifier: EcosystemIdentifier
  ): TokenFA12 | TokenFA2 | undefined;
}

