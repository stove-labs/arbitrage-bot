import { DEBUG } from '../consoleReporterPlugin';

export const handleLifeCycleStart = () => {
  if (!DEBUG) return;

  return 'Life cycle started';
};
