import { expect } from 'chai';
import { getProfitFromOperation } from '../src/handleTezosSwapExecution';
import { operationResults as operationResultsXtzBaseToken } from './operation-results-xtz-to-token-to-xtz';
import { operationResults as operationResultsTokenBaseToken } from './operation-results-token-to-xtz-to-token';
import { OperationContentsAndResultTransaction } from '@taquito/rpc';

describe('handleTezosSwapExecution', () => {
  describe('getProfitFromOperation', () => {
    describe('XTZ->Token->XTZ', () => {
      it('can calculate profit from operation.results', () => {
        const exchange1Address = 'KT1HuAKauGmCrhGgn3TN2DtrV3qfr4RnhxQW';
        const exchange2Address = 'KT1Unv26ghEmAUSCJrrpJuNkZFbh8441PzDC';

        const profit = getProfitFromOperation(
          operationResultsXtzBaseToken as OperationContentsAndResultTransaction[],
          exchange1Address,
          exchange2Address
        );

        expect(profit).to.equal('16913');
      });
    });
    describe('TOKEN->XTZ->TOKEN', () => {
      it('can calculate profit from operation.results', () => {
        const exchange1Address = 'KT1GJtvtNzSpznsoMQT6qsRRHyauDGj3hixy';
        const exchange2Address = 'KT19ZwDsR3u2xVPydzyMeFLdv2asPY8ghRLH';

        const profit = getProfitFromOperation(
          operationResultsTokenBaseToken as OperationContentsAndResultTransaction[],
          exchange1Address,
          exchange2Address
        );
        expect(profit).to.equal('23034833105996905')
      });
    });
  });
});
