import { INFO } from '../consoleReporterPlugin';

export const handleLifeCycleEnd = () => {
  if (!INFO) return;

  return 'Waiting until life cycle restarts';
};
