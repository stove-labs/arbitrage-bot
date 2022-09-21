import {
    getAmountInGivenOut,
    getAmountOutGivenIn,
} from './pools/basic/basicPool';

// https://www.notion.so/stove-labs/Profit-Finder-d5844bc7e4ec4db48b2bfe395d42c256#7c18595d89fd4e5c9c7c122e47c2a22b
export const findOptimalAmount = () => {
    return '';
};

// https://www.notion.so/stove-labs/Profit-Finder-d5844bc7e4ec4db48b2bfe395d42c256#a13825caae334a9299d86ef06801709d
export const expectedProfitWithFees = (
    optimalAmount: string,
    reserveInSell: string,
    reserveOutSell: string,
    reserveInBuy: string,
    reserveOutBuy: string,
    fee: number
) => {
    const profit = getAmountOutGivenIn(
        optimalAmount,
        reserveOutSell,
        reserveInSell,
        fee
    ).minus(
        getAmountInGivenOut(optimalAmount, reserveInBuy, reserveOutBuy, fee)
    );
    return profit;
};
