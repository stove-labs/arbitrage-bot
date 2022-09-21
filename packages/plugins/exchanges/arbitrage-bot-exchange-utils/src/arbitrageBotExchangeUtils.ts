import { Token, ExchangeRegistry } from '@stove-labs/arbitrage-bot';

export const getExchangeAddressFromRegistry = (
    token1: Token,
    token2: Token,
    instances: ExchangeRegistry
): string | undefined => {
    {
        const exchangeInstance = instances.find((instance) => {
            return (
                (instance.ticker1 === token1.ticker &&
                    instance.ticker2 === token2.ticker) ||
                (instance.ticker1 === token2.ticker &&
                    instance.ticker2 === token1.ticker)
            );
        });
        return exchangeInstance ? exchangeInstance.address : undefined;
    }
};

