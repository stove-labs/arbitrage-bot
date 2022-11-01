import { TriggerCallback, TriggerPlugin } from '@stove-labs/arbitrage-bot';
import { TriggerChainPluginConfig } from './types';

export class TriggerChainPlugin implements TriggerPlugin {
  public running: boolean = false;
  public doTask;

  constructor(public config: TriggerChainPluginConfig) {
    this.doTask = this.withPause(15000);
  }

  register(triggerCallback: TriggerCallback) {
    this.doTask(() => {
      this.runCallback(triggerCallback);
    });
  }

  /**
   * Create a scheduler for calling callbacks with a fixed delay in-between each call.
   *
   * @param milliseconds the inbetween-delay in milliseconds
   * @returns a function to add callbacks to the queue
   */
  withPause(milliseconds) {
    const queue = [];
    let timeoutId = undefined;
    function pauseThenContinue() {
      timeoutId = setTimeout(function () {
        timeoutId = undefined;
        doNext();
      }, milliseconds);
    }
    function doNext() {
      if (queue.length && timeoutId === undefined) {
        queue.shift()();
        pauseThenContinue();
      }
    }
    return function (callback) {
      queue.push(callback);
      doNext();
    };
  }

  async runCallback(triggerCallback: TriggerCallback) {
    if (this.running) return;
    this.running = true;
    try {
      triggerCallback().then(() => {
        this.doTask(() => {
          this.runCallback(triggerCallback);
        });
      });
    } finally {
      this.running = false;
    }
  }

  unregister() {}
}
