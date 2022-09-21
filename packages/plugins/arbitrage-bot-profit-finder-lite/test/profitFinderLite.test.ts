import { ExchangePrice } from '@stove-labs/arbitrage-bot';
import { ProfitFinderLitePlugin } from '../src/profitFinderLite';

describe('profitFinderLite.ts', () => {
    const prices = [
        {
            baseToken: { ticker: 'XTZ' },
            baseTokenBalance: { amount: '105937017709' },
            quoteToken: { ticker: 'SMAK' },
            quoteTokenBalance: { amount: '18078985513' },
            exchangeIdentifier: undefined,
            fee: 3
        },
        {
            baseToken: { ticker: 'XTZ' },
            baseTokenBalance: { amount: '7428931624' },
            quoteToken: { ticker: 'SMAK' },
            quoteTokenBalance: { amount: '1260808197' },
            exchangeIdentifier: 'QUIPUSWAP',
            fee: 3
        }
    ] as ExchangePrice[];

    it('', () => {
        const plugin = new ProfitFinderLitePlugin();
        const profitOpportunity = plugin.findProfits(prices);
        
    });
});
