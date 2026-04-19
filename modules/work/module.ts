import type { ModuleDefinition } from '@types';

export const workModule: ModuleDefinition = {
  slug: 'work',
  name: 'Trabajo',
  description: 'Tracking de jornadas, entregas y métricas de desempeño tipo trabajo gig.',
  supportedEvents: ['viaje_completado', 'tarea_finalizada'],
  defaultConfig: {},
};
