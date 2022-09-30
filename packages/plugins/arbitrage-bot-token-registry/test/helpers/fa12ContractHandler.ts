import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { Fa12Code } from './fa12/fa12.code';
import { Fa12ContractType, Storage } from './fa12/fa12.types';
import { tas } from './type-aliases';
import { initStorage as defaultStorage } from './fa12/fa12.default_storage';
import saveAddress from './saveContractAddress';

const createContractHandler = () => {
  const Tezos = new TezosToolkit('http://localhost:20000');

  let contract: Fa12ContractType;
  let contractAddress: undefined | string;

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
        await Tezos.contract.originate<Fa12ContractType>({
          code: Fa12Code.code,
          storage: initialStorage ? initialStorage : defaultStorage,
        });

      await originateContractOperation.confirmation(1);
      contractAddress = originateContractOperation.contractAddress;

      console.log('originated with address', contractAddress);

      contract = await Tezos.contract.at<Fa12ContractType>(contractAddress!);

      saveAddress('fa12TokenContract', contractAddress);

      return originateContractOperation;
    },
    loadContract: async (address: string) => {
      contract = await Tezos.contract.at<Fa12ContractType>(address);
      return contract;
    },
    transfer: async (from: string, to: string, amount: number) => {
      const transferOperation = await contract.methods
        .transfer(tas.address(from), tas.address(to), tas.nat(amount))
        .send();

      await transferOperation.confirmation(1);

      return transferOperation;
    },
    /**
     * The owner of the token is the signer.
     * Do not forget to switch signers
     */
    approve: async (spender: string, amount: number) => {
      const approveOperation = await contract.methods
        .approve(tas.address(spender), tas.nat(amount))
        .send();

      await approveOperation.confirmation(1);

      return approveOperation;
    },
  };

  return service;
};

export const ContractHandler = createContractHandler();
