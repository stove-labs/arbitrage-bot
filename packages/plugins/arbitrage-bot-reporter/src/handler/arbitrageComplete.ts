import { Report } from '@stove-labs/arbitrage-bot';
import { formattedTicker, tickerColor, STATUS, blue } from '../consoleReporterPlugin';

export const handleArbitrageComplete = (report?: Report) => {
  if (!STATUS) return;
  if (!report) return 'Finishing arbitrage...';

  return (
    `Delta base token:     ${blue(calculateDelta(
      report.baseTokenDelta,
      report.baseToken
    ))}\n` +
    `Delta quote token:    ${blue(calculateDelta(
      report.quoteTokenDelta,
      report.quoteToken
    ))}`
  );
};

const calculateDelta = (delta, token): string => {
  return `${tickerColor(formattedTicker(token.ticker))} ${(
    Number(delta) /
    10 ** token.decimals
  ).toFixed(token.decimals)}`;
};
