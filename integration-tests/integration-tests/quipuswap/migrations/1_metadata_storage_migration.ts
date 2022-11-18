import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import config from '../../../config';
import accounts from '../../accounts';
import metadataContract from '../contracts/MetadataStorage.json';
import metadataStorage from '../storage/MetadataStorage';
import writeAddressToFile from '../../saveDeployment';
import chalk from 'chalk';
const yellow = chalk.yellow;

(async () => {
  const tezos = new TezosToolkit(config.rpc);
  const signer = await new InMemorySigner(accounts.alice.sk);
  tezos.setSignerProvider(signer);

  const originationOperation = await tezos.contract.originate({
    code: JSON.parse(metadataContract.michelson),
    storage: metadataStorage,
  });
  await originationOperation.confirmation(1);

  await writeAddressToFile(
    'metadataContract',
    originationOperation.contractAddress
  );
  console.log(
    yellow('Metadata contract address:', originationOperation.contractAddress)
  );
})();
