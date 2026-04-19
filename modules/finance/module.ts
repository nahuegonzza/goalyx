import type { ModuleDefinition } from '@types';

export const financeModule: ModuleDefinition = {
  slug: 'finance',
  name: 'Finanzas',
  description: 'Eventos de gastos e ingresos con métricas y puntos asociados.',
  supportedEvents: ['dinero_gastado', 'dinero_ganado'],
  defaultConfig: {},
};
