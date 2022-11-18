import { EcosystemIdentifier } from '../ecosystem/types';
import { Token } from '../token/types';

export interface AccountantPlugin {
  getBalance(token: Token, ecosystemIdentifier: EcosystemIdentifier);
}
