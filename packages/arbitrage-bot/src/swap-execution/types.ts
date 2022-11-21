import { EcosystemIdentifier, ExchangeIdentifier, Token } from '../types';

export interface Operation {
  ecosystem: EcosystemIdentifier;
  exchanges: ExchangeIdentifier[];
  operationHash: string;
  profit: {
    amount: string;
    decimals: string;
  };
  totalOperationCost: string;
  baseToken: Token;
  quoteToken: Token;
}

export interface SwapResult {
  result:
    | {
        type: 'OK';
        operation: Operation;
      }
    | {
        type: 'ERROR';
        data: any;
      };
}
