import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { Fa2Code } from './fa2/fa2.code';
import { Fa2ContractType, MethodsObject, Storage } from './fa2/fa2.types';
import { tas } from './type-aliases';
import { initStorage as defaultStorage } from './fa2/fa2.default_storage';
import saveAddress from './saveContractAddress';

const createContractHandler = () => {
  const Tezos = new TezosToolkit('http://localhost:20000');

  let contract: undefined | Fa2ContractType;
  let contractAddress: undefined | string;

  type AddOperatorParam = Parameters<MethodsObject['add_operator']>[0];
  type RemoveOperatorParam = Parameters<MethodsObject['remove_operator']>[0];

  type NestedAddOperatorParam = {
    add_operator: AddOperatorParam;
  };
  type NestedRemoveOperatorParam = {
    remove_operator: RemoveOperatorParam;
  };
  type AddOrRemoveOperatorParam =
    | NestedAddOperatorParam
    | NestedRemoveOperatorParam;

  const service = {
    setSigner: async (secret: string) => {
      const signer = await InMemorySigner.fromSecretKey(secret);
      Tezos.setSignerProvider(signer);
    },
    setDefaultSigner: async () => {
      await service.setSigner(
        'edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt'
      );
    },
    originateContract: async (initialStorage?: Storage) => {
      const originateContractOperation =
        await Tezos.contract.originate<Fa2ContractType>({
          code: Fa2Code.code,
          storage: initialStorage? initialStorage : defaultStorage,
        });

      await originateContractOperation.confirmation(1);
      // save contract address
      contractAddress = originateContractOperation.contractAddress;

      console.log('originated with address', contractAddress);

      saveAddress('fa2TokenContract', contractAddress);

      // save smart contract instance
      contract = await Tezos.contract.at<Fa2ContractType>(contractAddress!);

      return originateContractOperation;
    },
    loadContract: async (address: string) => {
      contract = await Tezos.contract.at<Fa2ContractType>(address);
      return contract;
    },
    transfer: async (
      from: string,
      to: string,
      tokenId: number,
      amount: number
    ) => {
      const operation = await contract?.methods
        .transfer([
          {
            from_: tas.address(from),
            txs: [
              {
                to_: tas.address(to),
                token_id: tas.nat(tokenId),
                amount: tas.nat(amount),
              },
            ],
          },
        ])
        .send();

      await operation?.confirmation(1);
    },
    add_operator: async (owner: string, operator: string, tokenId: number) => {
      // TODO: type return type without contract instance dependency
      if (!contract) throw new Error('Contract not known');
      type UpdateOperatorsReturn = ReturnType<
        typeof contract.methods.add_operator
      >;

      type methods = {
        update_operators: (
          operatorUpdates: AddOrRemoveOperatorParam[]
        ) => UpdateOperatorsReturn;
      } & typeof contract.methods;

      const updateOperators = await (contract!.methods as unknown as methods)
        .update_operators([
          {
            add_operator: {
              owner: tas.address(owner),
              operator: tas.address(operator),
              token_id: tas.nat(tokenId),
            },
          },
        ])
        .send();
      await updateOperators.confirmation(1);

      console.log(
        updateOperators.operationResults[0].metadata.operation_result.status
      );
    },
    remove_operator: async (
      owner: string,
      operator: string,
      tokenId: number
    ) => {
      // TODO: type return type without contract instance dependency
      if (!contract) throw new Error('Contract not known');

      type UpdateOperatorsReturn = ReturnType<
        typeof contract.methods.add_operator
      >;

      type methods = {
        update_operators: (
          operatorUpdates: AddOrRemoveOperatorParam[]
        ) => UpdateOperatorsReturn;
      } & typeof contract.methods;

      const updateOperators = await (contract!.methods as unknown as methods)
        .update_operators([
          {
            remove_operator: {
              owner: tas.address(owner),
              operator: tas.address(operator),
              token_id: tas.nat(tokenId),
            },
          },
        ])
        .send();

      await updateOperators.confirmation(1);
      console.log(
        updateOperators.operationResults[0].metadata.operation_result.status
      );
    },
  };

  return service;
};

export const ContractHandler = createContractHandler();
