import { EcosystemIdentifier, Token } from '../types';

export interface AccountantPlugin {
  getBalance(token: Token, ecosystemIdentifier: EcosystemIdentifier);
}
