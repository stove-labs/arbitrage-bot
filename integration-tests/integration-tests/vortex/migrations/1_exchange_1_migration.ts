const standard = process.env.EXCHANGE_TOKEN_STANDARD || 'FA12';
const tokenTotalSupply = process.env.TOKEN_TOTAL_SUPPLY;
const tokenDexAmount = process.env.TOKEN_DEX_2_AMOUNT;
const tezDexAmount = process.env.TEZ_DEX_2_AMOUNT;
const defaultTokenId = process.env.DEFAULT_TOKEN_ID_FA2;

import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import config from '../../config';
import accounts from '../../accounts';
import { FactoryFa12Code } from '../contracts/factory_fa12.code';
import {
  FactoryFa12ContractType,
  Storage,
} from '../contracts/factory_fa12.types';
import { tas } from '../contracts/type-aliases';
import chalk from 'chalk';
import writeAddressToFile from '../../saveDeployment';
const yellow = chalk.yellow;

import tokenContract from '../../deployments/tokenFA12';

(async () => {
  const tezos = new TezosToolkit(config.rpc);
  const signer = await new InMemorySigner(accounts.alice.sk);
  tezos.setSignerProvider(signer);

  const originationOperation = await tezos.contract.originate({
    code: FactoryFa12Code.code,
    storage: {
      counter: tas.nat(0),
      default_metadata: tas.bigMap([]),
      default_reserve: tas.address(accounts.alice.pkh),
      default_token_metadata: tas.bigMap([]),
      empty_allowances: tas.bigMap([]),
      empty_history: tas.bigMap([]),
      empty_tokens: tas.bigMap([]),
      empty_user_investments: tas.bigMap([]),
      swaps: tas.bigMap([]),
      token_to_swaps: tas.bigMap([]),
    } as Storage,
  });
  await originationOperation.confirmation(1);
  const factoryAddress = originationOperation.contractAddress;
  await writeAddressToFile('vortex_factory1', factoryAddress);
  console.log(yellow('Vortex Factory 1 contract address:', factoryAddress));

  const factoryInstance = await tezos.contract.at<FactoryFa12ContractType>(
    factoryAddress!
  );
  const tokenInstance = await tezos.contract.at(tokenContract);

  const approveOperation = await tokenInstance.methods
    .approve(factoryInstance.address, tokenDexAmount)
    .send();
  await approveOperation.confirmation(1);

  const tezAmount = 10 ** 6 * Number(tezDexAmount);

  const launchExchangeOperation = await factoryInstance.methods
    .launchExchange(tas.address(tokenContract), tas.nat(tokenDexAmount!))
    .send({ amount: tezAmount, mutez: true });

  await launchExchangeOperation.confirmation(1);
  const internalOperationResultsExchange =
    launchExchangeOperation.operationResults[0].metadata
      .internal_operation_results![0];
  const exchangeAddress =
    internalOperationResultsExchange.result['originated_contracts'][0];

  await writeAddressToFile('vortexExchange', exchangeAddress);
  console.log(yellow('Vortex Exchange address:', exchangeAddress));
})();
