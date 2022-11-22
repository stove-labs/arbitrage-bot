import { NativeToken, TokenFA12, TokenFA2 } from '../types';

export interface Report {
  baseTokenDelta: string;
  baseToken: NativeToken | TokenFA12 | TokenFA2;
  quoteTokenDelta: string;
  quoteToken: NativeToken | TokenFA12 | TokenFA2;
}
