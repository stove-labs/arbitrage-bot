import { ProfitOpportunity } from '@stove-labs/arbitrage-bot';
import { BigNumber } from 'bignumber.js';
import { cyan, green, red } from 'chalk';
import { formattedTicker, tickerColor, profitColor, DEBUG, INFO, STATUS } from '../consoleReporterPlugin';

export const handleProfitFound = (profitOpportunity?: ProfitOpportunity) => {
  if (!profitOpportunity) return 'Searching for profit opportunity...';
  const profit = Number(profitOpportunity.profit.baseTokenAmount);
  const isPositiveProfit = BigNumber(profit).isPositive();
  if (!isPositiveProfit) return 'Profit opportunity not detected';
  let message = '';

  // INFO('Profit opportunity ' + warning('computed'));

  // report whether profit opportunity was detected

  message = updateMessage(
    message,
    STATUS,
    `Profit opportunity:   ${green('Detected')}`
  );
  // Report on SWAP 1
  message = updateMessage(message, INFO, getSwap1Spend(profitOpportunity));
  // Report on SWAP 2
  (message = updateMessage(message, INFO, getSwap2Receive(profitOpportunity))),
    // report expected profit
    (message = isPositiveProfit
      ? updateMessage(message, STATUS, getExpectedProfit(profitOpportunity))
      : updateMessage(message, INFO, getExpectedProfit(profitOpportunity)));

  // report trading path
  message = isPositiveProfit
    ? updateMessage(message, STATUS, getTradingPath(profitOpportunity))
    : updateMessage(message, INFO, getTradingPath(profitOpportunity));

  message = updateMessage(message, DEBUG, JSON.stringify(profitOpportunity,null, 2));

  return message;
};

const getSwap1Spend = (profitOpportunity: ProfitOpportunity) => {
  const tokenInTicker = profitOpportunity.swaps[0].tokenIn.ticker;
  const tokenInAmount = profitOpportunity.swaps[0].limitWithoutSlippage;
  const tokenInDecimals = profitOpportunity.swaps[0].tokenInDecimals;
  return (
    'Spend:                ' +
    tickerColor(formattedTicker(tokenInTicker)) +
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
    'Receive:              ' +
    tickerColor(formattedTicker(tokenOutTicker)) +
    cyan(
      ` ${(Number(tokenOutAmount) / 10 ** tokenOutDecimals).toFixed(
        tokenOutDecimals
      )}`
    )
  );
};

const getTradingPath = (profitOpportunity: ProfitOpportunity) => {
  return (
    'Path:                 ' +
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
    `Expected profit:      ` +
    tickerColor(formattedTicker(tokenOutTicker)) +
    profitColor(isPositiveProfit)(expectedProfitString) +
    ' (w/o tx fees)'
  );
};

const updateMessage = (
  message: string,
  shouldInclude: boolean,
  addition: any
): string => {
  if (!shouldInclude) return message;

  return message + addition.toString() + '\n';
};
