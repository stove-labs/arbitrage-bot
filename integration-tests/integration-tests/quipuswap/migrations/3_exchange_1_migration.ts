import * as dotenv from 'dotenv';
dotenv.config();
const standard = process.env.EXCHANGE_TOKEN_STANDARD || 'FA12';
const tokenTotalSupply = process.env.TOKEN_TOTAL_SUPPLY;
const tokenDexAmount = process.env.TOKEN_DEX_1_AMOUNT;
const tezDexAmount = process.env.TEZ_DEX_1_AMOUNT;
const defaultTokenId = process.env.DEFAULT_TOKEN_ID_FA2;

import writeAddressToFile from '../../saveDeployment';
import { TezosToolkit, OpKind, ParamsWithKind } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { MichelsonMap } from '@taquito/michelson-encoder';
import accounts from '../../accounts';
import config from '../../config';
import factoryStorage from '../storage/Factory';
import metadataStorageInstance from '../../deployments/metadataContract';
import bakeryInstance from '../../deployments/bakerRegistry';

(async () => {
  if (['FA2', 'FA12'].includes(standard)) {
    const Factory = require(`../contracts/Factory${standard}`);
    const Token = require('../contracts/Token' + standard);
    const tokenStorage = require('../storage/TokenParameterized' + standard);
    const { dexFunctions, tokenFunctions } = require('../storage/Functions');

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
      'factory1',
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

    const tokenOriginationOperation = await tezos.contract.originate({
      code: JSON.parse(Token.michelson),
      storage: tokenStorage(tokenTotalSupply),
    });
    await tokenOriginationOperation.confirmation(1);

    await writeAddressToFile(
      'token' + standard,
      tokenOriginationOperation.contractAddress
    );

    console.log(`Token address: ${tokenOriginationOperation.contractAddress}`);

    let tokenInstance = await tezos.contract.at(
      tokenOriginationOperation.contractAddress!
    );

    if (standard === 'FA12') {
      let approveTokenOperation = await tokenInstance.methods
        .approve(factoryOriginationOperation.contractAddress!, tokenDexAmount)
        .send();
      await approveTokenOperation.confirmation(1);

      const launchExchangeOperation = await factoryInstance.methods
        .launchExchange(
          tokenOriginationOperation.contractAddress,
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

      await writeAddressToFile('exchange1', exchangeAddress);
      console.log('Exchange 1 address:', exchangeAddress);
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
          tokenOriginationOperation.contractAddress,
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

      await writeAddressToFile('exchange1', exchangeAddress);
      console.log('Exchange 1 address:', exchangeAddress);
    }
  }
})();
