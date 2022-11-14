import { SwapResult } from '@stove-labs/arbitrage-bot';
import { STATUS, warning, green, red } from '../consoleReporterPlugin';
import { BigNumber } from 'bignumber.js';

export const handleSwapsDone = (swapResults: SwapResult[]) => {
  if (!STATUS) return;
  if (!swapResults) return 'Performing swap...';
  if (swapResults.some((swap) => swap.result.type === 'ERROR')) {
    const errors = swapResults.reduce((errors, swap) => {
      if (swap.result.type === 'OK') return;

      return errors + '\n' + swap.result.data;
    }, '');
    return 'Swap unsuccessful\n' + `${errors}`;
  }
  let message: string = '';

  swapResults.map((swap) => {
    if (swap.result.type === 'ERROR') return;
    const profitAndCosts = `Profit: ${formattedProfit(swap)}\nTransaction costs: ${formattedCosts(swap)}`;
      // swap.result.operation.baseToken.ticker === 'XTZ'
      //   ? `Total profit: ${totalProfit(swap)}`
      //   : `Profit: ${formattedProfit(swap)}\nCosts: ${formattedCosts(swap)}`;
    const transaction = warning(
      `https://tzkt.io/${swap.result.operation?.operationHash}\n`
    );

    message +=
      `${green('Swap successful')}\n` +
      `${profitAndCosts}\n` +
      `Transaction link: ${transaction}`;
  });

  return message;
};

const totalProfit = (swap: SwapResult): string => {
  if (swap.result.type === 'ERROR') return '';

  return `${warning('XTZ')} ${green(
    BigNumber(swap.result.operation?.profit?.amount)
      .minus(BigNumber(swap.result.operation?.totalOperationCost))
      .dividedBy(
        new BigNumber(10).pow(Number(swap.result.operation?.profit?.decimals))
      )
  )}`;
};

const formattedProfit = (swap: SwapResult): string => {
  if (swap.result.type === 'ERROR') return '';

  return `${warning(swap.result.operation.baseToken.ticker)} ${green(
    BigNumber(swap.result.operation?.profit?.amount).dividedBy(
      new BigNumber(10).pow(Number(swap.result.operation?.profit?.decimals))
    )
  )}`;
};

const formattedCosts = (swap: SwapResult): string => {
  if (swap.result.type === 'ERROR') return '';

  return `${warning('XTZ')} ${red(
    BigNumber(swap.result.operation?.totalOperationCost).dividedBy(
      new BigNumber(10).pow(6)
    )
  )}`;
};
