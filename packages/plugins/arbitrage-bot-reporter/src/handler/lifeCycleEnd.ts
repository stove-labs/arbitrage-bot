import { DEBUG } from '../consoleReporterPlugin';

export const handleLifeCycleEnd = () => {
  if (!DEBUG) return;

  return 'Waiting until life cycle restarts';
};
