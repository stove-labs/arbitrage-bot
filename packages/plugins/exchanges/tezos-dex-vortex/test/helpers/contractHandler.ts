import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { VortexDexTezTokenCode } from './vortex-dex-tez-token.code';
import {
  VortexDexTezTokenContractType,
  Storage,
} from './vortex-dex-tez-token.types';
import { tas } from './type-aliases';
import { initStorage as defaultStorage } from './vortex-dex-tez-token.default_storage';
import saveContractAddress from './saveContractAddress';

const createContractHandler = () => {
  const Tezos = new TezosToolkit('http://localhost:20000');

  let contract: undefined | VortexDexTezTokenContractType;
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
        await Tezos.contract.originate<VortexDexTezTokenContractType>({
          code: VortexDexTezTokenCode.code,
          storage: initialStorage ? initialStorage : defaultStorage,
        });

      await originateContractOperation.confirmation(1);

      contractAddress = originateContractOperation.contractAddress;
      console.log('originated with address', contractAddress);
      saveContractAddress('tezosDexVortex', contractAddress)

      contract = await Tezos.contract.at<VortexDexTezTokenContractType>(
        contractAddress!
      );

      return originateContractOperation;
    },
    xtzToToken: async (to: string, minTokensBought: number, deadline: Date) => {
      const operation = await contract?.methods
        .xtzToToken(
          tas.address(to),
          tas.nat(minTokensBought),
          tas.timestamp(deadline) // string
        )
        .send();
      await operation?.confirmation(1);
    },
    tokenToXtz: async (
      to: string,
      tokensSold: number,
      minXtzBought: number,
      deadline: Date
    ) => {
      const operation = await contract?.methods
        .tokenToXtz(
          tas.address(to),
          tas.nat(tokensSold),
          tas.mutez(minXtzBought),
          tas.timestamp(deadline)
        )
        .send();
      await operation?.confirmation(1);
    },
  };

  return service;
};

export const ContractHandler = createContractHandler();
