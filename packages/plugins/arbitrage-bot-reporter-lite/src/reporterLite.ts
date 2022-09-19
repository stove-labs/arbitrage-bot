import {ReporterPlugin, ReporterPluginEvent} from "@stove-labs/arbitrage-bot";

export class ConsoleReporterPlugin implements ReporterPlugin {
    report(event: ReporterPluginEvent) {
      // pretty print would be nice
      console.log(event);
    }
  }