import { TriggerCallback, TriggerPlugin } from "@stove-labs/arbitrage-bot";
import { TriggerIntervalPluginConfig } from "./types";

export class TriggerIntervalPlugin implements TriggerPlugin {
  public timer: NodeJS.Timer;
  public running: boolean = false;

  constructor(public config: TriggerIntervalPluginConfig) {}
  register(triggerCallback: TriggerCallback) {
    this.timer = setInterval(() => {
      this.runCallback(triggerCallback);
    }, this.config.interval);
  }

  async runCallback(triggerCallback: TriggerCallback) {
    if (this.running) return;
    this.running = true;
    try {
      await triggerCallback();
    } finally {
      this.running = false;
    }
  }

  unregister() {
    clearInterval(this.timer);
  }
}
