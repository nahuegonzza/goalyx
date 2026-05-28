import type { ModuleDefinition, ModuleEntry } from '@types';
import GymConfig from './GymConfig';
import GymDashboard from './GymDashboard';

export const gymModule: ModuleDefinition = {
  slug: 'gym',
  name: 'Gimnasio',
  description: 'Seguimiento de rutinas, levantamiento de pesos y mejoras en el progreso físico.',
  supportedEvents: ['entrenamiento', 'peso_levantado', 'series_completadas'],
  defaultConfig: {
    weeklyTarget: 3,
    trainingDays: [1, 3, 5],
    weightGoal: 75,
    volumeGoal: 8000
  },
  ConfigComponent: GymConfig,
  Component: GymDashboard,
  calculateScore: (entries: ModuleEntry[], config: Record<string, unknown>, targetDate?: string) => {
    const target = targetDate || new Date().toISOString().slice(0, 10);
    const targetKey = target.slice(0, 10);

    return entries.reduce((sum, entry) => {
      const entryDate = entry.date.slice(0, 10);
      if (entryDate !== targetKey) return sum;
      try {
        const data = typeof entry.data === 'string' ? JSON.parse(entry.data) : entry.data;
        const attended = data?.attended ? 2 : 0;
        const volume = Number(data?.totalVolume ?? 0);
        const volumePoints = Math.floor(volume / 500);
        return sum + attended + volumePoints;
      } catch {
        return sum;
      }
    }, 0);
  }
};
