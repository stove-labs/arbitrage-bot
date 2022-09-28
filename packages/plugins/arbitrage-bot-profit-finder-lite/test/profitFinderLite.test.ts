import { ExchangePrice, TokenDecimals, TokenPlugin } from '@stove-labs/arbitrage-bot';
import { ProfitFinderLitePlugin } from '../src/profitFinderLite';

describe('profitFinderLite.ts', () => {
  const prices = [
    {
      baseToken: { ticker: 'XTZ' },
      baseTokenBalance: { amount: '1247026403' },
      quoteToken: { ticker: 'USD' },
      quoteTokenBalance: { amount: '19328447920594343' },
      exchangeIdentifier: 'QUIPUSWAP',
      fee: 3,
    },
    {
      baseToken: { ticker: 'XTZ' },
      baseTokenBalance: { amount: '50125177994' },
      quoteToken: { ticker: 'USD' },
      quoteTokenBalance: { amount: '7594296904728968' },
      exchangeIdentifier: 'SPICYSWAP',
      fee: 3,
    },
  ] as ExchangePrice[];

  it('', () => {
    // mocking the token registry
    const tokenRegistry = {
      getTokenDecimals: () => {
        return { baseToken: 6, quoteToken: 12 } as TokenDecimals;
      },
    } as unknown as TokenPlugin;
    
    const plugin = new ProfitFinderLitePlugin({ tokenRegistry, profitSplitForSlippage: 2 });
    const profitOpportunity = plugin.findProfits(prices);
    console.log(profitOpportunity)
  });
});
