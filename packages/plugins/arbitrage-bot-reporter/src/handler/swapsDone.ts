import { SwapResult } from '@stove-labs/arbitrage-bot';
import {
  formattedTicker,
  STATUS,
  warning,
  green,
  red,
  tickerColor,
} from '../consoleReporterPlugin';
import { BigNumber } from 'bignumber.js';

export const handleSwapsDone = (swapResults?: SwapResult[]) => {
  if (!STATUS) return;
  if (!swapResults) return 'Performing swap...';
  if (swapResults.some((swap) => swap.result.type === 'ERROR')) {
    const errors = swapResults.reduce((errors, swap) => {
      if (swap.result.type === 'OK') return;

      return errors + JSON.stringify(swap.result.data, null, 2) + '\n';
    }, '');
    const message =
      `Status:               ${red('Swap unsuccessful')}\n` +
      `Error:                \n${red(errors)}`;
    return message;
  }
  let message: string = '';

  swapResults.map((swap) => {
    if (swap.result.type === 'ERROR') return;
    const transaction = warning(
      `https://tzkt.io/${swap.result.operation?.operationHash}`
    );
    const netProfit =
      swap.result.operation.baseToken.ticker === 'XTZ'
        ? `Net profit:           ${formattedNetProfit(swap)}\n`
        : '';

    message +=
      `Status:               ${green('Swap successful')}\n` +
      `Profit:               ${formattedProfit(swap)}\n` +
      `Transaction costs:    ${formattedCosts(swap)}\n` +
      `${netProfit}` +
      `Transaction link:     ${transaction}`;
  });

  return message;
};

const formattedNetProfit = (swap: SwapResult): string => {
  if (swap.result.type === 'ERROR') return '';

  return `${tickerColor(formattedTicker('XTZ'))} ${green(
    BigNumber(swap.result.operation?.profit?.amount)
      .minus(BigNumber(swap.result.operation?.totalOperationCost))
      .dividedBy(
        new BigNumber(10).pow(Number(swap.result.operation?.profit?.decimals))
      )
  )}`;
};

const formattedProfit = (swap: SwapResult): string => {
  if (swap.result.type === 'ERROR') return '';

  return `${tickerColor(
    formattedTicker(swap.result.operation.baseToken.ticker)
  )} ${green(
    BigNumber(swap.result.operation?.profit?.amount).dividedBy(
      new BigNumber(10).pow(Number(swap.result.operation?.profit?.decimals))
    )
  )}`;
};

const formattedCosts = (swap: SwapResult): string => {
  if (swap.result.type === 'ERROR') return '';

  return `${tickerColor(formattedTicker('XTZ'))} ${red(
    BigNumber(swap.result.operation?.totalOperationCost).dividedBy(
      new BigNumber(10).pow(6)
    )
  )}`;
};
