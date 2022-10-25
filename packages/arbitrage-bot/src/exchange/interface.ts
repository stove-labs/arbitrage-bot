import { Swap, Token, TokenPlugin } from '../types';
import { EcosystemIdentifier } from '../types';
import { ExchangeIdentifier, ExchangePrice, ExchangeFee, ExchangePluginConfig, ExchangeRegistry } from './types';

export interface ExchangePlugin {
  config: ExchangePluginConfig;
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
  fetchPrice(baseToken: Token, quoteToken: Token): Promise<ExchangePrice>;
  forgeOperation(swap: Swap, botAddress: string);
}
