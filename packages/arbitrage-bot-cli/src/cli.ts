import { ArbitrageBotCore } from '@stove-labs/arbitrage-bot';
import { config } from './config.example.arbitrage-bot';
import { getDuplicateTradingPairsFromAllExchanges } from '@stove-labs/arbitrage-bot-exchange-utils';
import _ from 'lodash';


var argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('\nUsage: ${0} [cmd] <args>')
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .command('start <b> <q>', 'arbitrage bot 🤖', {}, function (argv) {
    console.log(argv);
    const core = new ArbitrageBotCore(config);
    core.start();
  })
  .describe('b', 'base token ticker')
  .describe('q', 'quote token ticker')
  .example('start', 'ts-node $0 start')
  .command('list', 'known tickers', {}, function () {
    const exchangeRegistry = config.plugins.exchanges.map((exchangePlugin) => {
      return exchangePlugin.instances;
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
  .epilog('⚠️  Experimental software, use at own risk!').argv;

argv.showHelp();


// import yargs from 'yargs';

// yargs
//   .usage('\nUsage: ${0} [cmd] <args>')
//   .help('h')
//   .alias('h', 'help')
//   .alias('v', 'version')
//   .command('start', 'arbitrage bot 🤖', {}, function (argv) {
//     console.log(argv);
//     const core = new ArbitrageBotCore(config);
//     core.start();
//   })
//   .describe('b', 'base token ticker')
//   .describe('q', 'quote token ticker')
//   .demandOption(['b', 'q'])
//   .example('start', 'ts-node $0 start')
//   .command('list', 'known tickers', {}, function () {
//     const exchangeRegistry = config.plugins.exchanges.map((exchangePlugin) => {
//       return exchangePlugin.instances;
//     });

//     const tickersBothExchanges =
//       getDuplicateTradingPairsFromAllExchanges(exchangeRegistry);

//     console.log('The config allows for arbitrage between: ');
//     tickersBothExchanges.forEach(
//       (tradingPair: { ticker1: string; ticker2: string }) => {
//         console.log(`   ${tradingPair.ticker1} 🔁 ${tradingPair.ticker2}`);
//       }
//     );
//   })
//   .alias('l', 'list')
//   .epilog('⚠️  Experimental software, use at own risk!');

// yargs.showHelp();
