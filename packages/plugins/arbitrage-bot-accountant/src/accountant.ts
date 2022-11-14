import {
  AccountantPlugin,
  Balance,
  EcosystemIdentifier,
  NativeToken,
  Token,
  TokenFA12,
  TokenFA2,
  TokenPlugin,
} from '@stove-labs/arbitrage-bot';
import { TezosToolkit } from '@taquito/taquito';

export class Accountant implements AccountantPlugin {
  constructor(
    public botAddress: Record<EcosystemIdentifier, string>,
    public tokenPlugin: TokenPlugin,
    public provider: Record<EcosystemIdentifier, any>
  ) {}

  async getBalance(token: Token, ecosystemIdentifier: EcosystemIdentifier) {
    const tokenInstance = this.tokenPlugin.getTokenInfo(
      token,
      ecosystemIdentifier
    );

    switch (ecosystemIdentifier) {
      case 'TEZOS':
        return await this.handleTezosBalance(tokenInstance);
      default:
        throw new Error(
          `Can't fetch balance for unknown ecosystem: ${ecosystemIdentifier}.`
        );
    }
  }

  async handleTezosBalance(token: NativeToken | TokenFA12 | TokenFA2) {
    const provider = this.provider.TEZOS as TezosToolkit;
    let balance: Balance;

    switch (token.address) {
      // XTZ
      case 'native':
        balance = {
          amount: await (
            await provider.tz.getBalance(this.botAddress.TEZOS)
          ).toFixed(),
        };
        break;
      // FA12 and FA2
      default:
        const tokenContractInstance = await provider.contract.at(token.address);
        balance = {
          amount: (
            await tokenContractInstance.views.getBalance(this.botAddress).read()
          ).toFixed(),
        };
    }

    return {
      token,
      balance,
    };
  }
}
