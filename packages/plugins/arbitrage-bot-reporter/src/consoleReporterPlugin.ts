import { ReporterPlugin, ReporterPluginEvent } from '@stove-labs/arbitrage-bot';
import { Logger } from 'tslog';
import chalk from 'chalk';
import { handleProfitFound } from './handler/profitFound';
import { handlePricesFetched } from './handler/pricesFetched';
import { handleLifeCycleStart } from './handler/lifeCycleStart';
import { handleLifeCycleEnd } from './handler/lifeCycleEnd';
import { handleSwapsDone } from './handler/swapsDone';
import { handleArbitrageComplete } from './handler/arbitrageComplete';
import ora, { Ora } from 'ora';

const argv = require('yargs/yargs')(process.argv.slice(2))
  .count('verbose')
  .alias('v', 'verbose').argv;

const VERBOSE_LEVEL = argv.verbose;

export const STATUS = VERBOSE_LEVEL >= 0;
export const INFO = VERBOSE_LEVEL >= 1;
export const DEBUG = VERBOSE_LEVEL >= 2;

export const green = chalk.green;
export const warning = chalk.yellow;
export const blue = chalk.blue;
export const red = chalk.red;
export const tickerColor = chalk.yellow;
export const profitColor = (isPositive: boolean) => {
  return isPositive ? green : red;
};
// pad ticker shorter than 5 chars
export const formattedTicker = (ticker: string): string => {
  const FORMATTED_TICKER_LENGTH = 5;

  return (ticker + '    ').substring(0, FORMATTED_TICKER_LENGTH);
};

export class ConsoleReporterPlugin implements ReporterPlugin {
  log: Logger;
  spinner: Ora;

  constructor() {
    this.log = new Logger();
    this.log.setSettings({
      dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  report(event: ReporterPluginEvent): string {
    switch (event.type) {
      case 'LIFECYCLE_START':
        this.spinner && this.spinner.stop();
        return handleLifeCycleStart();
      case 'PRICES_FETCHED':
        return handlePricesFetched(event.prices);
      case 'PROFIT_FOUND':
        return handleProfitFound(event.profitOpportunity);
      case 'ARBITRAGE_COMPLETE':
        return handleArbitrageComplete(event.report);
      case 'LIFECYCLE_END':
        this.spinner = ora({
          text: 'Waiting until life cycle restarts',
          color: 'yellow',
        }).start();
        return '';
      case 'SWAPS_DONE':
        return handleSwapsDone(event.swapResults);
      default:
        // this.log.info(event);
        break;
    }
  }
}
