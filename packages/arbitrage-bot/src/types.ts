import { EcosystemIdentifier, EcosystemKey } from './ecosystem/types';
import { AccountantPlugin } from './accountant/interface';
import { ExchangePlugin } from './exchange/interface';
import { ProfitFinderPlugin } from './profit-finder/interface';
import { ReporterPlugin } from './reporter/interface';
import { SwapExecutionManager } from './swap-execution/interface';
import { TokenPlugin } from './token/interface';
import { Token } from './token/types';
import { TriggerPlugin } from './trigger/types';

export * from './accountant/interface';

export * from './blockchain/types';

export * from './ecosystem/types';

export * from './exchange/interface';
export * from './exchange/types';

export * from './profit-finder/interface';
export * from './profit-finder/types';

export * from './reporter/interface';
export * from './reporter/types';

export * from './swap-execution/interface';
export * from './swap-execution/types';

export * from './token/interface';
export * from './token/types';

export * from './trigger/types';

export interface Config {
  baseToken: Token;
  quoteToken: Token;
  plugins: {
    exchanges: ExchangePlugin[];
    token: TokenPlugin;
    trigger: TriggerPlugin;
    reporter: ReporterPlugin;
    profitFinder: ProfitFinderPlugin;
    keychains: Record<EcosystemIdentifier, EcosystemKey>[];
    accountant?: AccountantPlugin;
    swapExecutionManager: SwapExecutionManager;
  };
}
