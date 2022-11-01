import { Swap, Token, TokenPlugin } from '../types';
import { EcosystemIdentifier } from '../types';
import {
  ExchangeIdentifier,
  ExchangePrice,
  ExchangePluginConfig,
} from './types';
import {
  withKind,
  TransferParams,
  OpKind,
} from '@taquito/taquito';

export interface ExchangePlugin {
  config: ExchangePluginConfig;
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
  fetchPrice(baseToken: Token, quoteToken: Token): Promise<ExchangePrice>;
  forgeOperation(
    swap: Swap,
    botAddress: string
  ): Promise<withKind<TransferParams, OpKind.TRANSACTION>[]>;
}
