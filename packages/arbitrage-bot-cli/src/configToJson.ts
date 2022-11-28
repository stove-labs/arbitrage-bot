import { writeFileSync } from 'fs';
import path, { join } from 'path';
import quipuswapExchangeRegistry from './exchanges/tezos/quipuswap';
import vortexExchangeRegistry from './exchanges/tezos/vortex';
import { defaultAliceSecret } from './keys/tezos/defaultKey';
import { rpc as tezosRpc } from './keys/tezos/defaultRpc';
import tokenList from './tokens/tezos/tokens';

export const exportConfigToFile = () => {
  const initConfig = {
    exchangeList: {
      quipuswap: quipuswapExchangeRegistry,
      vortex: vortexExchangeRegistry,
    },
    tokenList,
    keys: { tezos: { secretKey: defaultAliceSecret, rpc: tezosRpc } },
    plugins: { trigger: { interval: 15000 } },
  };

  writeFileSync(
    join(path.resolve(), 'config.json'),
    JSON.stringify(initConfig, null, 2),
    {
      flag: 'w',
    }
  );
};

export const loadConfigFromFile = (path: string): JSON | undefined => {
  try {
    const configFromFile = require(path) as JSON;

    // console.log(`Using config.json`);
    return configFromFile;
  } catch (e) {
    console.log(
      `Can't find config.json, proceeding with default Tezos configuration`
    );
    return undefined;
  }
};
