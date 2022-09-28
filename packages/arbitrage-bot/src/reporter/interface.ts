import { ReporterPluginEvent } from './types';

export interface ReporterPlugin {
  report(event: ReporterPluginEvent): void;
}
