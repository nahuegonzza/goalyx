import type { ModuleDefinition } from '@types';

export const gymModule: ModuleDefinition = {
  slug: 'gym',
  name: 'Gimnasio',
  description: 'Seguimiento de rutinas, levantamiento de pesos y mejoras en el progreso físico.',
  supportedEvents: ['entrenamiento', 'peso_levantado', 'series_completadas'],
  defaultConfig: {},
};
