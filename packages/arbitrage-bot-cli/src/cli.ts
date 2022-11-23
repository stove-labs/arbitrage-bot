#!/usr/bin/env node
import { ArbitrageBotCore } from '@stove-labs/arbitrage-bot';
import getConfig from './config.example.arbitrage-bot';
import { getDuplicateTradingPairsFromAllExchanges } from '@stove-labs/arbitrage-bot-exchange-utils';
import _ from 'lodash';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { asciLogo } from './asciLogo';

yargs(hideBin(process.argv))
  .usage(`${asciLogo}`)
  .usage(`\nUsage: $0 [command]`)
  .options({
    b: { type: 'string', describe: 'base token ticker' },
    q: { type: 'string', describe: 'quote token ticker' },
  })
  .command(
    'start <b> <q>',
    'arbitrage bot 🤖',
    (yargs) => {
      yargs
        .positional('b', { describe: 'base token ticker', type: 'string' })
        .positional('q', { describe: 'quote token ticker', type: 'string' })
        .option('v', { describe: 'verbose logging', type: 'boolean' })
        .option('vv', { describe: 'debugging', type: 'boolean' });
    },
    async (argv) => {
      const config = await getConfig();
      config.baseToken.ticker = argv.b;
      config.quoteToken.ticker = argv.q;
      const core = new ArbitrageBotCore(config);
      core.start();
    }
  )
  .example('$0 start', '-h')
  .example('$0 start', 'XTZ kUSD')
  .command('list', 'known tickers', {}, async () => {
    const config = await getConfig();
    const exchangeRegistry = config.plugins.exchanges.map((exchangePlugin) => {
      return exchangePlugin.config.exchangeInstances;
    });

    const tickersBothExchanges =
      getDuplicateTradingPairsFromAllExchanges(exchangeRegistry);

    console.log('The config allows for arbitrage between: ');
    tickersBothExchanges.forEach(
      (tradingPair: { ticker1: string; ticker2: string }) => {
        console.log(`   ${tradingPair.ticker1} 🔁 ${tradingPair.ticker2}`);
      }
    );
  })
  .alias('l', 'list')
  .showHelpOnFail(false, 'Specify -h for available options')
  .epilog('⚠️  Experimental software, use at own risk!')
  .alias('v', 'verbose')
  .alias('vv', 'debugging')
  .alias('h', 'help')
  .recommendCommands()
  .version(false)
  // .showHelp()
  .parse();
