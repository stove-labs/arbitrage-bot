import { ReporterPlugin, ReporterPluginEvent } from '@stove-labs/arbitrage-bot';
import { Logger } from 'tslog';
import chalk from 'chalk';
import { handleProfitFound } from './events/profitFound';

export const green = chalk.green;
export const warning = chalk.yellow;
export const blue = chalk.blue;
export const red = chalk.red;



export class ConsoleReporterPlugin implements ReporterPlugin {
  log: Logger;
  constructor() {
    this.log = new Logger();
    this.log.setSettings({
      dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }
  report(event: ReporterPluginEvent) {
    if (event.type === 'PROFIT_FOUND') {
     handleProfitFound(event.profitOpportunity)
    } else {
      this.log.info(event);
    }
  }
}
