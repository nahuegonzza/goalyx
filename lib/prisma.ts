import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClient;
};

function normalizeDatabaseUrl(url?: string) {
  if (!url) {
    return url;
  }

  const trimmedUrl = url.trim();

  if (/supabase\.co/.test(trimmedUrl) && !/[?&]sslmode=/.test(trimmedUrl)) {
    return trimmedUrl.includes('?') ? `${trimmedUrl}&sslmode=require` : `${trimmedUrl}?sslmode=require`;
  }

  return trimmedUrl;
}

const normalizedDatabaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (!normalizedDatabaseUrl) {
    throw new Error('Missing DATABASE_URL environment variable.');
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: normalizedDatabaseUrl,
      },
    },
    errorFormat: 'pretty',
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}

export const prisma = getPrismaClient();
