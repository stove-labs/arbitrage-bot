#!/usr/bin/env node
import { ArbitrageBotCore } from '@stove-labs/arbitrage-bot';
import getConfig from './config.example.arbitrage-bot';
import { getDuplicateTradingPairsFromAllExchanges } from '@stove-labs/arbitrage-bot-exchange-utils';
import _ from 'lodash';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { asciLogo } from './asciLogo';
import { exportConfigToFile, loadConfigFromFile } from './configToJson';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

const configFromFile = loadConfigFromFile(process.cwd() + '/config.json');

const list = async () => {
  const config = await getConfig(configFromFile);
  const exchangeRegistry = config.plugins.exchanges.map((exchangePlugin) => {
    return exchangePlugin.config.exchangeInstances;
  });

  console.log('The config allows for arbitrage between: ');

  const exchanges: [number, string][] = config.plugins.exchanges
    .map((exchangePlugin) => {
      return exchangePlugin.config.identifier;
    })
    .map((value, i) => [i, value]);

  const tickersBothExchanges =
    getDuplicateTradingPairsFromAllExchanges(exchangeRegistry);
  const tokenPairs: [number, string][] = tickersBothExchanges
    .map((tradingPair: { ticker1: string; ticker2: string }) => {
      return `${tradingPair.ticker1} 🔁 ${tradingPair.ticker2}`;
    })
    .map((value, i) => [i, value]);

  const exchangeTable = new AsciiTable3('Supported exchanges')
    .setHeading('No.', 'Exchange Name')
    .addRowMatrix(exchanges).setStyle('unicode-mix')
    .setAlignCenter(1)
    .setAlignCenter(2)
    .setWidth(2, 20);
  const tokenTable = new AsciiTable3('Supported trading pairs')
    .setHeading('No.', 'Pair Name')
    .addRowMatrix(tokenPairs).setStyle('unicode-mix')
    .setAlignCenter(1)
    .setAlignCenter(2)
    .setWidth(2, 20);

  console.log(exchangeTable.toString());
  console.log(tokenTable.toString());
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
