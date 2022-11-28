import { ExchangePlugin, ExchangeRegistry } from '@stove-labs/arbitrage-bot';
import { getDuplicateTradingPairsFromAllExchanges } from '@stove-labs/arbitrage-bot-exchange-utils';
import { AsciiTable3 } from 'ascii-table3';

export const getExchangesFromPluginConfig = (
  exchanges: ExchangePlugin[]
): [number, string][] => {
  return (
    exchanges
      // get all identifiers
      .map((exchangePlugin) => {
        return exchangePlugin.config.identifier;
      })
      // transform to array of [identifier, index]
      .map((identifier, index) => [++index, identifier])
  );
};

export const getExchangeTableAscii = (
  exchanges: [number, string][]
): string => {
  const exchangeTable = new AsciiTable3('Supported exchanges')
    .setHeading('No.', 'Exchange Name')
    .addRowMatrix(exchanges)
    .setStyle('unicode-mix')
    .setAlignCenter(1)
    .setAlignCenter(2)
    .setWidth(2, 20);

  return exchangeTable.toString();
};

export const getTokenPairsFromExchangeRegistry = (
  exchangeRegistry: ExchangeRegistry[]
): [number, string][] => {
  const tickersBothExchanges: { ticker1: string; ticker2: string }[] =
    getDuplicateTradingPairsFromAllExchanges(exchangeRegistry);

  const tokenPairs: [number, string][] = tickersBothExchanges
    .map((tradingPair: { ticker1: string; ticker2: string }) => {
      return `${tradingPair.ticker1} 🔁 ${tradingPair.ticker2}`;
    })
    .map((tradingPair, index) => [++index, tradingPair]);
  return tokenPairs;
};

export const formatTokensAsAsciiTable = (
  tokenPairs: [number, string][]
): string => {
  return new AsciiTable3('Supported trading pairs')
    .setHeading('No.', 'Pair Name')
    .addRowMatrix(tokenPairs)
    .setStyle('unicode-mix')
    .setAlignCenter(1)
    .setAlignCenter(2)
    .setWidth(2, 20)
    .toString();
};
