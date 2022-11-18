import { EcosystemIdentifier } from '../ecosystem/types';
import {
  NativeToken,
  Token,
  TokenFA12,
  TokenFA2,
} from './types';

export interface TokenPlugin {
  getTokenAddress(
    token: Token,
    identifier: EcosystemIdentifier
  ): string | undefined;
  getTokenInfo(
    token: Token,
    identifier: EcosystemIdentifier
  ): TokenFA12 | TokenFA2 | NativeToken | undefined;
}
