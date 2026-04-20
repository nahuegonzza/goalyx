import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClient;
};

export function normalizeDatabaseUrl(url?: string) {
  if (!url) {
    return url;
  }

  let trimmedUrl = url.trim();

  if (
    (trimmedUrl.startsWith('"') && trimmedUrl.endsWith('"')) ||
    (trimmedUrl.startsWith("'") && trimmedUrl.endsWith("'"))
  ) {
    trimmedUrl = trimmedUrl.slice(1, -1).trim();
  }

  // Remove accidental trailing semicolon or whitespace
  trimmedUrl = trimmedUrl.replace(/;$/, '').trim();

  if (/(supabase\.co|pooler\.supabase\.com)/.test(trimmedUrl) && !/[?&]sslmode=/.test(trimmedUrl)) {
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

  process.env.DATABASE_URL = normalizedDatabaseUrl;
  console.log('[Prisma] Initializing client with URL:', normalizedDatabaseUrl.substring(0, 50) + '...');

  const prisma = new PrismaClient({
    adapter: new PrismaPg(normalizedDatabaseUrl),
    errorFormat: 'pretty',
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Add connection event handlers
  prisma.$on('error', (e) => {
    console.error('[Prisma Error]', e);
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
}

export const prisma = getPrismaClient();
