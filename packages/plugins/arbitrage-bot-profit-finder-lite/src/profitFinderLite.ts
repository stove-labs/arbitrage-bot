import { ProfitFinderPlugin } from '@stove-labs/arbitrage-bot';
import { ExchangePrice, ProfitOpportunity } from '@stove-labs/arbitrage-bot';
import { findOptimalAmount } from './math';

export class ProfitFinderLitePlugin implements ProfitFinderPlugin {
    findProfits(prices: ExchangePrice[]): ProfitOpportunity {
        // calls some internal math to find profits
        // solve quadratic equation for x1,x2
        const amount = findOptimalAmount();
        // expectedProfitWithFees()
        return {} as ProfitOpportunity;
    }
}
