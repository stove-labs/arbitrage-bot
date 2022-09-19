import { ArbitrageBotCore } from "@stove-labs/arbitrage-bot";
import { config } from "./example-config.arbitrage-bot";

export const run = async () => {
  const core = new ArbitrageBotCore(config);
  await core.start()
  console.log('TODO')
};
