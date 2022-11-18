import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import BakerRegistry from '../contracts/BakerRegistry.json';
import { MichelsonMap } from '@taquito/michelson-encoder';
import config from '../../../config';
import accounts from '../../accounts';
import writeAddressToFile from '../../saveDeployment';
import chalk from 'chalk';
const yellow = chalk.yellow;

(async () => {
  const tezos = new TezosToolkit(config.rpc);
  const signer = await new InMemorySigner(accounts.alice.sk);
  tezos.setSignerProvider(signer);

  const originationOperation = await tezos.contract.originate({
    code: JSON.parse(BakerRegistry.michelson),
    storage: MichelsonMap.fromLiteral({}),
  });
  await originationOperation.confirmation(1);

  await writeAddressToFile(
    'bakerRegistry',
    originationOperation.contractAddress
  );
  console.log(
    yellow(
      'Baker registry contract address',
      originationOperation.contractAddress
    )
  );
})();
