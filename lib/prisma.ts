import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = globalForPrisma.prisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client;
    }
    return (client as any)[prop];
  }
});
