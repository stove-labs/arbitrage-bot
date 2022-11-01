import { ReporterPlugin, ReporterPluginEvent } from '@stove-labs/arbitrage-bot';
import { Logger } from 'tslog';
import chalk from 'chalk';
import { handleProfitFound } from './handler/profitFound';
import { handlePricesFetched } from './handler/pricesFetched';
import { handleLifeCycleStart } from './handler/lifeCycleStart';
import ora, { Ora } from 'ora';
import { BigNumber } from 'bignumber.js';

const argv = require('yargs/yargs')(process.argv.slice(2))
  .count('verbose')
  .alias('v', 'verbose').argv;

const VERBOSE_LEVEL = argv.verbose;

export const STATUS = VERBOSE_LEVEL >= 0 ? console.log : () => {};
export const INFO = VERBOSE_LEVEL >= 1 ? console.log : () => {};
export const DEBUG = VERBOSE_LEVEL >= 2 ? console.log : () => {};

export const green = chalk.green;
export const warning = chalk.yellow;
export const blue = chalk.blue;
export const red = chalk.red;
export const tickerColor = chalk.yellow;

export class ConsoleReporterPlugin implements ReporterPlugin {
  log: Logger;

  spinner: Ora;
  isSpinning: boolean = false;

  constructor() {
    this.log = new Logger();
    this.log.setSettings({
      dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }
  report(event: ReporterPluginEvent) {
    switch (event.type) {
      case 'LIFECYCLE_START':
        if (!this.isSpinning) this.spinner = ora().start();
        this.isSpinning = this.spinner.isSpinning;
        handleLifeCycleStart();
        this.spinner.color = 'yellow';
        this.spinner.text = 'Life cycle started';
        break;
      case 'PROFIT_FOUND':
        this.spinner.color = 'green';
        this.spinner.text = 'Profit opportunity computed';
        handleProfitFound(event.profitOpportunity);
        if (
          BigNumber(event.profitOpportunity.profit.baseTokenAmount).isNegative
        ) {
          this.spinner.text = 'Waiting until life cycle restarts';
          this.spinner.color = 'white';
        }
        break;
      case 'PRICES_FETCHED':
        this.spinner.color = 'yellow';
        this.spinner.text = 'Prices fetched';
        handlePricesFetched(event.prices);
        break;
      default:
        this.log.info(event);
        break;
    }
  }
}
