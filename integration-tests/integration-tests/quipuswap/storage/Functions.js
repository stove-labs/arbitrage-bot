module.exports.dexFunctions = [
  {
    index: 0,
    name: 'initialize_exchange',
    args: require('./parameterValues/dexFunctions/initialize_exchange.json'),
  },
  {
    index: 1,
    name: 'tez_to_token',
    args: require('./parameterValues/dexFunctions/tez_to_token.json'),
  },
  {
    index: 2,
    name: 'token_to_tez',
    args: require('./parameterValues/dexFunctions/token_to_tez.json'),
  },
  {
    index: 3,
    name: 'withdraw_profit',
    args: require('./parameterValues/dexFunctions/withdraw_profit.json'),
  },
  {
    index: 4,
    name: 'invest_liquidity',
    args: require('./parameterValues/dexFunctions/invest_liquidity.json'),
  },
  {
    index: 5,
    name: 'divest_liquidity',
    args: require('./parameterValues/dexFunctions/divest_liquidity.json'),
  },
  {
    index: 6,
    name: 'vote',
    args: require('./parameterValues/dexFunctions/vote.json'),
  },
  {
    index: 7,
    name: 'veto',
    args: require('./parameterValues/dexFunctions/veto.json'),
  },
  {
    index: 8,
    name: 'receive_reward',
    args: require('./parameterValues/dexFunctions/receive_reward.json'),
  },
];

let tokenFunctionsFA12 = [
  {
    index: 0,
    name: 'transfer',
    args: require('./parameterValues/tokenFunctions/fa12/transfer.json'),
  },
  {
    index: 1,
    name: 'approve',
    args: require('./parameterValues/tokenFunctions/fa12/approve.json'),
  },
  {
    index: 2,
    name: 'get_balance',
    args: require('./parameterValues/tokenFunctions/fa12/get_balance.json'),
  },
  {
    index: 3,
    name: 'get_allowance_to_contract',
    args: require('./parameterValues/tokenFunctions/fa12/get_allowance_to_contract.json'),
  },
  {
    index: 4,
    name: 'get_total_supply',
    args: require('./parameterValues/tokenFunctions/fa12/get_total_supply.json'),
  },
];

let tokenFunctionsFA2 = [
  {
    index: 0,
    name: 'transfer',
    args: require('./parameterValues/tokenFunctions/fa2/transfer.json'),
  },
  {
    index: 1,
    name: 'update_operators',
    args: require('./parameterValues/tokenFunctions/fa2/update_operators.json'),
  },
  {
    index: 2,
    name: 'get_balance_of',
    args: require('./parameterValues/tokenFunctions/fa2/get_balance_of.json'),
  },
];
module.exports.tokenFunctions = {
  FA12: tokenFunctionsFA12,
  FA2: tokenFunctionsFA2,
};
