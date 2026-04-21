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
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);
    
    const todayEntry = entries.find(e => {
      const entryDate = e.date.slice(0, 10); // Extract YYYY-MM-DD from ISO string
      return entryDate === today;
    });
    if (!todayEntry) return 0;

    const data = JSON.parse(todayEntry.data);
    const hours = Number(data.hours || 0);
    if (hours === 0) return 0; // Si no hay horas registradas, 0 puntos directamente

    const idealHours = (config.idealHours as number) || 8;
    const maxPoints = (config.maxPoints as number) || 2;
    const penaltyMode = (config.penaltyMode as string) || 'automatic';
    const penaltyPerHour = (config.penaltyPerHour as number) || 1;

    const diff = Math.abs(hours - idealHours);
    const penalty = penaltyMode === 'automatic' ? diff : penaltyPerHour * diff;

    return Math.max(0, maxPoints - penalty); // Ensure score doesn't go negative
  },
  Component: SleepDashboard,
  HistoryComponent: SleepHistory,
};
