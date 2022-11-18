import {
  ExchangeIdentifier,
  ExchangePrice,
  ExchangePluginConfig,
} from './types';
import { withKind, TransferParams, OpKind } from '@taquito/taquito';
import { EcosystemIdentifier } from '../ecosystem/types';
import { Token } from '../token/types';
import { Swap } from '../blockchain/types';

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
