import { Token } from '../types';
import { EcosystemIdentifier } from '../types';
import { ExchangeIdentifier, ExchangePrice, ExchangeFee } from './types';

export interface ExchangePlugin {
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
  fetchPrice(baseToken: Token, quoteToken: Token): Promise<ExchangePrice>;
  // TODO research fee structures for the same x*y=k CFMM
  // getFee(baseToken: Token, quoteToken: Token): ExchangeFee;
}
