#!/usr/bin/env node
import { ArbitrageBotCore } from '@stove-labs/arbitrage-bot';
import getConfig from './config.example.arbitrage-bot';
import _ from 'lodash';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { asciLogo } from './asciLogo';
import { exportConfigToFile, loadConfigFromFile } from './configToJson';

import {
  formatTokensAsAsciiTable,
  getExchangesFromPluginConfig,
  getExchangeTableAscii as formatExchangeAsAsciiTable,
  getTokenPairsFromExchangeRegistry,
} from './commands/list/utils';

const configFromFile = loadConfigFromFile(process.cwd() + '/config.json');

const list = async () => {
  const config = await getConfig(configFromFile);

  console.log('The config allows for arbitrage between: ');

  const exchanges = getExchangesFromPluginConfig(config.plugins.exchanges);
  const exchangeInfoAsTable = formatExchangeAsAsciiTable(exchanges);
  console.log(exchangeInfoAsTable);

  const exchangeRegistry = config.plugins.exchanges.map((exchangePlugin) => {
    return exchangePlugin.config.exchangeInstances;
  });
  const tokenPairs = getTokenPairsFromExchangeRegistry(exchangeRegistry);
  const tokenPairsAsTable = formatTokensAsAsciiTable(tokenPairs);
  console.log(tokenPairsAsTable);
};

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
      const config = await getConfig(configFromFile);

      config.baseToken.ticker = argv.b;
      config.quoteToken.ticker = argv.q;
      const core = new ArbitrageBotCore(config);
      console.log('CLI v' + require('../package.json').version)
      core.start();
    }
  )
  .example('$0 start', '-h')
  .example('$0 start', 'XTZ kUSD')
  .command('list', 'known tickers', {}, list)
  .command('init', 'creates an example config file', {}, () => {
    exportConfigToFile();
    console.log('config.json initialized');
    list();
  })
  .alias('l', 'list')
  .showHelpOnFail(false, 'Specify -h for available options')
  .epilog('⚠️  Experimental software, use at own risk!')
  .alias('v', 'verbose')
  .alias('vv', 'debugging')
  .alias('h', 'help')
  .recommendCommands()
  .version(false)
  //.showHelp()
  .parse();
