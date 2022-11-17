import { STATUS } from '../consoleReporterPlugin';

export const handleLifeCycleEnd = () => {
  if (!STATUS) return;

  return 'Waiting until life cycle restarts';
};
