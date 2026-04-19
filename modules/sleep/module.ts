import type { ModuleDefinition, ModuleEntry } from '@types';
import { SleepDashboard } from './SleepDashboard';
import { SleepHistory } from './SleepHistory';

export const sleepModule: ModuleDefinition = {
  slug: 'sleep',
  name: 'Sueño',
  description: 'Control de duración y calidad de sueño con eventos que alimentan el score.',
  supportedEvents: ['sleep_hours', 'sleep_quality'],
  defaultConfig: {
    idealHours: 8,
    maxPoints: 2,
    penaltyMode: 'automatic', // 'automatic' or 'manual'
    penaltyPerHour: 1, // for manual mode
  },
  calculateScore: (entries: ModuleEntry[], config: Record<string, unknown>) => {
    const todayEntry = entries.find(e => {
      const entryDate = new Date(e.date).toDateString();
      const today = new Date().toDateString();
      return entryDate === today;
    });
    if (!todayEntry) return 0;

    const data = JSON.parse(todayEntry.data);
    const hours = Number(data.hours || 0);
    const idealHours = (config.idealHours as number) || 8;
    const maxPoints = (config.maxPoints as number) || 2;
    const penaltyMode = (config.penaltyMode as string) || 'automatic';
    const penaltyPerHour = (config.penaltyPerHour as number) || 1;

    const diff = Math.abs(hours - idealHours);
    const penalty = penaltyMode === 'automatic' ? diff : penaltyPerHour * diff;

    return maxPoints - penalty;
  },
  Component: SleepDashboard,
  HistoryComponent: SleepHistory,
};
