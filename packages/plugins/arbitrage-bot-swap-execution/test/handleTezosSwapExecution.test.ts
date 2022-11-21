import { expect } from 'chai';
import { getProfitFromOperation } from '../src/handleTezosSwapExecution';
import { operationResults } from './operation-results-xtz-to-token-to-xtz';
import { OperationContentsAndResultTransaction } from '@taquito/rpc';

describe('handleTezosSwapExecution', () => {
  describe('getProfitFromOperation', () => {
    describe('XTZ->Token->XTZ', () => {
      it('can calculate profit from operation.results', () => {
        const botAddress = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';
        const exchange1Address = 'KT1HuAKauGmCrhGgn3TN2DtrV3qfr4RnhxQW';
        const exchange2Address = 'KT1Unv26ghEmAUSCJrrpJuNkZFbh8441PzDC';

        const profit = getProfitFromOperation(
          operationResults as OperationContentsAndResultTransaction[],
          botAddress,
          exchange1Address,
          exchange2Address
        );

        expect(profit).to.equal('16913');
      });
    });
    describe('TOKEN->XTZ->TOKEN', () => {
        // TODO
        it.skip('can calculate profit from operation.results', () => {};
    })
  });
});
