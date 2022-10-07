const { MichelsonMap } = require('@taquito/michelson-encoder');
import accounts from '../../accounts';

module.exports = (balance) => {
  return {
    owner: accounts.alice.pkh,
    total_supply: balance,
    ledger: MichelsonMap.fromLiteral({
      [accounts.alice.pkh]: {
        balance: balance,
        allowances: MichelsonMap.fromLiteral({}),
      },
    }),
  };
};
