const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PoolConfig } = require('pg');

function normalizeDatabaseUrl(url) {
  if (!url) return url;
  let trimmedUrl = url.trim();
  if ((trimmedUrl.startsWith('"') && trimmedUrl.endsWith('"')) || (trimmedUrl.startsWith("'") && trimmedUrl.endsWith("'"))) {
    trimmedUrl = trimmedUrl.slice(1, -1).trim();
  }
  trimmedUrl = trimmedUrl.replace(/;$/, '').trim();
  if (/pooler\.supabase\.com|:6543/.test(trimmedUrl)) {
    try {
      const parsed = new URL(trimmedUrl);
      const params = parsed.searchParams;
      if (!params.has('sslmode')) params.set('sslmode', 'require');
      if (!params.has('sslaccept')) params.set('sslaccept', 'accept_invalid_certs');
      if (!params.has('uselibpqcompat')) params.set('uselibpqcompat', 'true');
      parsed.search = params.toString();
      return parsed.toString();
    } catch {
      let result = trimmedUrl;
      if (!/[?&]sslmode=/.test(result)) result += (result.includes('?') ? '&' : '?') + 'sslmode=require';
      if (!/[?&]sslaccept=/.test(result)) result += (result.includes('?') ? '&' : '?') + 'sslaccept=accept_invalid_certs';
      if (!/[?&]uselibpqcompat=/.test(result)) result += (result.includes('?') ? '&' : '?') + 'uselibpqcompat=true';
      return result;
    }
  }
  if (/supabase\.co/.test(trimmedUrl) && !/[?&]sslmode=/.test(trimmedUrl)) {
    return trimmedUrl.includes('?') ? `${trimmedUrl}&sslmode=require` : `${trimmedUrl}?sslmode=require`;
  }
  return trimmedUrl;
}

const fs = require('fs');
const path = require('path');

const envPath = fs.existsSync(path.join(process.cwd(), '.env.local'))
  ? path.join(process.cwd(), '.env.local')
  : path.join(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match) {
      const [, key, rawValue] = match;
      let value = rawValue;
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = process.env[key] || value;
    }
  });
}

const normalizedDatabaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
const poolConfig = {
  connectionString: normalizedDatabaseUrl,
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
  idleTimeoutMillis: 10000,
  max: 3,
  min: 0,
  allowExitOnIdle: true,
  statement_timeout: 10000,
};

console.log('DATABASE_URL:', normalizedDatabaseUrl ? normalizedDatabaseUrl.substring(0, 100) + '...' : '<undefined>');
const prisma = new PrismaClient({
  adapter: new PrismaPg(poolConfig),
  errorFormat: 'pretty',
  log: ['error'],
});

(async () => {
  try {
    const indexes = await prisma.$queryRaw`SELECT indexname, indexdef FROM pg_indexes WHERE schemaname='public' AND tablename='Module'`;
    console.log(JSON.stringify(indexes, null, 2));
  } catch (err) {
    console.error('ERROR', err);
  } finally {
    await prisma.$disconnect();
  }
})();
