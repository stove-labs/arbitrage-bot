import { ProfitOpportunity } from '@stove-labs/arbitrage-bot';
import { BigNumber } from 'bignumber.js';
import { cyan, green, red } from 'chalk';
import {
  warning,
  tickerColor,
  DEBUG,
  INFO,
  STATUS,
} from '../consoleReporterPlugin';

const profitColor = (isPositive: boolean) => {
  return isPositive ? green : red;
};

export const handleProfitFound = (profitOpportunity: ProfitOpportunity) => {
  const profit = Number(profitOpportunity.profit.baseTokenAmount);
  const isPositiveProfit = BigNumber(profit).isPositive();

  // INFO('Profit opportunity ' + warning('computed'));

  // report whether profit opportunity was detected
  STATUS(
    'Profit opportunity ' +
      profitColor(isPositiveProfit)(
        isPositiveProfit ? `detected` : `not detected`
      )
  );
  // Report on SWAP 1
  INFO(getSwap1Spend(profitOpportunity));
  // Report on SWAP 2
  INFO(getSwap2Receive(profitOpportunity));

  // report expected profit
  isPositiveProfit
    ? STATUS(getExpectedProfit(profitOpportunity))
    : INFO(getExpectedProfit(profitOpportunity));

  // report trading path
  isPositiveProfit
    ? STATUS(getTradingPath(profitOpportunity))
    : INFO(getTradingPath(profitOpportunity));

  DEBUG(profitOpportunity);
};

const getSwap1Spend = (profitOpportunity: ProfitOpportunity) => {
  const tokenInTicker = profitOpportunity.swaps[0].tokenIn.ticker;
  const tokenInAmount = profitOpportunity.swaps[0].limitWithoutSlippage;
  const tokenInDecimals = profitOpportunity.swaps[0].tokenInDecimals;
  return (
    'Spend ' +
    tickerColor(tokenInTicker) +
    cyan(
      ` ${(Number(tokenInAmount) / 10 ** tokenInDecimals).toFixed(
        tokenInDecimals
      )}`
    )
  );
};

const getSwap2Receive = (profitOpportunity: ProfitOpportunity) => {
  const tokenOutTicker = profitOpportunity.swaps[1].tokenOut.ticker;
  const tokenOutAmount = profitOpportunity.swaps[1].limitWithoutSlippage;
  const tokenOutDecimals = profitOpportunity.swaps[1].tokenOutDecimals;
  return (
    'Receive ' +
    tickerColor(tokenOutTicker) +
    cyan(
      ` ${(Number(tokenOutAmount) / 10 ** tokenOutDecimals).toFixed(
        tokenOutDecimals
      )}`
    )
  );
};

const getTradingPath = (profitOpportunity: ProfitOpportunity) => {
  return (
    'Path: ' +
    tickerColor(profitOpportunity.swaps[0].tokenIn.ticker) +
    ' -> ' +
    tickerColor(profitOpportunity.swaps[0].tokenOut.ticker) +
    ' -> ' +
    tickerColor(profitOpportunity.swaps[1].tokenOut.ticker)
  );
};
const getExpectedProfit = (profitOpportunity: ProfitOpportunity) => {
  const profit = Number(profitOpportunity.profit.baseTokenAmount);
  const isPositiveProfit = BigNumber(profit).isPositive();
  const tokenOutTicker = profitOpportunity.swaps[1].tokenOut.ticker;
  const tokenOutDecimals = profitOpportunity.swaps[1].tokenOutDecimals;
  const expectedProfitString = ` ${profit / 10 ** tokenOutDecimals}`;

  return (
    `Expected profit ` +
    tickerColor(tokenOutTicker) +
    profitColor(isPositiveProfit)(expectedProfitString) +
    ' (w/o tx fees)'
  );
};
