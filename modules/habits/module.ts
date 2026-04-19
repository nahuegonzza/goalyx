import type { ModuleDefinition } from '@types';

export const habitModule: ModuleDefinition = {
  slug: 'habits',
  name: 'Hábitos manuales',
  description: 'Registro diario de hábitos con eventos tipo check-in y seguimiento básico.',
  supportedEvents: ['checkin_diario', 'habito_completado'],
  defaultConfig: {},
};
