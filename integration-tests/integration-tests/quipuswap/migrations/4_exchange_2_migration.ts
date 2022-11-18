const standard = process.env.EXCHANGE_TOKEN_STANDARD || 'FA12';
const tokenDexAmount = process.env.TOKEN_DEX_2_AMOUNT;
const tezDexAmount = process.env.TEZ_DEX_2_AMOUNT;
const defaultTokenId = process.env.DEFAULT_TOKEN_ID_FA2;

import writeAddressToFile from '../../saveDeployment';
import { TezosToolkit, OpKind, ParamsWithKind } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { MichelsonMap } from '@taquito/michelson-encoder';
import accounts from '../../accounts';
import config from '../../../config';
import factoryStorage from '../storage/Factory';
import metadataStorageInstance from '../../deployments/metadataContract';
import bakeryInstance from '../../deployments/bakerRegistry';

(async () => {
  if (['FA2', 'FA12'].includes(standard)) {
    const Factory = require(`../contracts/Factory${standard}`);

    const { dexFunctions, tokenFunctions } = require('../storage/Functions');
    const tokenDeployment = require('../../deployments/token' + standard);

    const tezos = new TezosToolkit(config.rpc);

    tezos.setProvider({
      config: {
        confirmationPollingTimeoutSecond: 900,
      },
      signer: await InMemorySigner.fromSecretKey(accounts.alice.sk),
    });

    factoryStorage.baker_validator = bakeryInstance;
    factoryStorage.metadata = MichelsonMap.fromLiteral({
      '': Buffer.from(
        'tezos-storage://' + metadataStorageInstance + '/quipu',
        'ascii'
      ).toString('hex'),
    });
    const factoryOriginationOperation = await tezos.contract.originate({
      code: JSON.parse(Factory.michelson),
      storage: factoryStorage,
    });
    await factoryOriginationOperation.confirmation(1);
    const factoryInstance = await tezos.contract.at(
      factoryOriginationOperation.contractAddress!
    );

    console.log(
      `Factory address: ${factoryOriginationOperation.contractAddress}`
    );
    await writeAddressToFile(
      'factory2',
      factoryOriginationOperation.contractAddress
    );

    const batchParametersDexFunctions: ParamsWithKind[] = dexFunctions.map(
      (dexFunction) => {
        const parameter = {
          kind: OpKind.TRANSACTION,
          to: factoryOriginationOperation.contractAddress!,
          amount: 0,
          parameter: {
            entrypoint: 'setDexFunction',
            value: dexFunction.args,
          },
        };
        return parameter;
      }
    );

    const batchDexFunctions = await tezos.contract
      .batch(batchParametersDexFunctions)
      .send();
    await batchDexFunctions.confirmation(1);

    let batchParametersTokenFunctions: ParamsWithKind[] = tokenFunctions[
      standard
    ].map((tokenFunction) => {
      const parameter = {
        kind: OpKind.TRANSACTION,
        to: factoryOriginationOperation.contractAddress!,
        amount: 0,
        parameter: {
          entrypoint: 'setTokenFunction',
          value: tokenFunction.args,
        },
      };

      return parameter;
    });

    const batchTokenFunctions = await tezos.contract
      .batch(batchParametersTokenFunctions)
      .send();
    await batchTokenFunctions.confirmation(1);

    let tokenInstance = await tezos.contract.at(tokenDeployment);

    if (standard === 'FA12') {
      let tokenApproveOperation = await tokenInstance.methods
        .approve(factoryOriginationOperation.contractAddress!, tokenDexAmount)
        .send();
      await tokenApproveOperation.confirmation(1);

      const launchExchangeOperation = await factoryInstance.methods
        .launchExchange(tokenDeployment, tokenDexAmount)
        .send({
          amount: 10 ** 6 * Number(tezDexAmount),
          mutez: true,
        });
      await launchExchangeOperation.confirmation(1);

      const internalOperationResultsExchange1 =
        launchExchangeOperation.operationResults[0].metadata
          .internal_operation_results![0];
      const exchangeAddress =
        internalOperationResultsExchange1.result['originated_contracts'][0];

      await writeAddressToFile('exchange2', exchangeAddress);
      console.log('Exchange 2 address:', exchangeAddress);
    } else {
      let updateOperatorsOperation = await tokenInstance.methods
        .update_operators([
          {
            add_operator: {
              owner: accounts.alice.pkh,
              operator: factoryInstance.address,
              token_id: defaultTokenId,
            },
          },
        ])
        .send();
      await updateOperatorsOperation.confirmation(1);

      const launchExchangeOperation = await factoryInstance.methods
        .launchExchange(
          tokenDeployment,
          defaultTokenId,
          tokenDexAmount
        )
        .send({
          amount: 10 ** 6 * Number(tezDexAmount),
          mutez: true,
        });
      await launchExchangeOperation.confirmation(1);

      const internalOperationResultsExchange1 =
        launchExchangeOperation.operationResults[0].metadata
          .internal_operation_results![0];
      const exchangeAddress =
        internalOperationResultsExchange1.result['originated_contracts'][0];

      await writeAddressToFile('exchange2', exchangeAddress);
      console.log('Exchange 2 address:', exchangeAddress);
    }
  }
})();
