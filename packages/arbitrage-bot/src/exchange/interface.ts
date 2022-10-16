import { Swap, Token } from '../types';
import { EcosystemIdentifier } from '../types';
import { ExchangeIdentifier, ExchangePrice, ExchangeFee, ExchangePluginConfig, ExchangeRegistry } from './types';

export interface ExchangePlugin {
  config: ExchangePluginConfig;
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
  instances: ExchangeRegistry
  fetchPrice(baseToken: Token, quoteToken: Token): Promise<ExchangePrice>;
  forgeOperation(swap: Swap, botAddress: string);
  // TODO research fee structures for the same x*y=k CFMM
  // getFee(baseToken: Token, quoteToken: Token): ExchangeFee;
}
