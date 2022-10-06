import {
  ProfitOpportunity,
} from '@stove-labs/arbitrage-bot';
import { BigNumber } from 'bignumber.js';
import { blue, green, red } from 'chalk';
import { warning } from '../consoleReporterPlugin';

const profitColor = (isPositive: boolean) => {
    return isPositive ? green : red;
  };
  

export const handleProfitFound = (profitOpportunity: ProfitOpportunity) => {
  const log = console.log;
  log(warning('Profit opportunity detected'));
  // SWAP 1
  const tokenInTicker = profitOpportunity.swaps[0].tokenIn.ticker;
  const tokenInAmount = profitOpportunity.swaps[0].limitWithoutSlippage;
  const tokenInDecimals = profitOpportunity.swaps[0].tokenInDecimals;
  log(
    'Spend ' +
      blue(
        `${tokenInTicker} ${(
          Number(tokenInAmount) /
          10 ** tokenInDecimals
        ).toFixed(tokenInDecimals)}`
      )
  );

  // SWAP 2
  const tokenOutTicker = profitOpportunity.swaps[1].tokenOut.ticker;
  const tokenOutAmount = profitOpportunity.swaps[1].limitWithoutSlippage;
  const tokenOutDecimals = profitOpportunity.swaps[1].tokenOutDecimals;
  log(
    'Receive ' +
      blue(
        `${tokenOutTicker} ${(
          Number(tokenOutAmount) /
          10 ** tokenOutDecimals
        ).toFixed(tokenOutDecimals)}`
      )
  );

  const profit = Number(profitOpportunity.profit.baseTokenAmount);
  const expectedProfitString = `${tokenOutTicker} ${
    profit / 10 ** tokenOutDecimals
  }`;

  const isPositiveProfit = BigNumber(profit).isPositive();

  log(
    'Expected profit ' +
      profitColor(isPositiveProfit)(expectedProfitString) +
      ' (w/o tx fees)'
  );

  log(
    'Path: ' +
      profitOpportunity.swaps[0].tokenIn.ticker +
      ' -> ' +
      profitOpportunity.swaps[0].tokenOut.ticker +
      ' -> ' +
      profitOpportunity.swaps[1].tokenOut.ticker
  );

  profitOpportunity.swaps[0].limitWithoutSlippage;
};
