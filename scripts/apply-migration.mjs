import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

function normalizeDatabaseUrl(url) {
  if (!url) return url;

  let trimmedUrl = url.trim();

  if (
    (trimmedUrl.startsWith('"') && trimmedUrl.endsWith('"')) ||
    (trimmedUrl.startsWith("'") && trimmedUrl.endsWith("'"))
  ) {
    trimmedUrl = trimmedUrl.slice(1, -1).trim();
  }

  trimmedUrl = trimmedUrl.replace(/;$/, '').trim();

  // Ensure SSL and libpq compatibility for pooler connections
  if (/pooler\.supabase\.com|:6543/.test(trimmedUrl)) {
    try {
      const url = new URL(trimmedUrl);
      const params = url.searchParams;

      if (!params.has('sslmode')) {
        params.set('sslmode', 'require');
      }
      if (!params.has('sslaccept')) {
        params.set('sslaccept', 'accept_invalid_certs');
      }
      if (!params.has('uselibpqcompat')) {
        params.set('uselibpqcompat', 'true');
      }

      url.search = params.toString();
      return url.toString();
    } catch {
      let result = trimmedUrl;
      if (!/[?&]sslmode=/.test(result)) {
        const separator = result.includes('?') ? '&' : '?';
        result += `${separator}sslmode=require`;
      }
      if (!/[?&]sslaccept=/.test(result)) {
        result += `&sslaccept=accept_invalid_certs`;
      }
      if (!/[?&]uselibpqcompat=/.test(result)) {
        result += `&uselibpqcompat=true`;
      }
      return result;
    }
  }

  return trimmedUrl;
}

async function applyMigration() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL environment variable.');
  }

  const normalizedDatabaseUrl = normalizeDatabaseUrl(databaseUrl);
  console.log('[Prisma] Initializing client with URL:', normalizedDatabaseUrl.substring(0, 50) + '...');

  // Configure PostgreSQL pool
  const pool = new Pool({
    connectionString: normalizedDatabaseUrl,
    connectionTimeoutMillis: 5000,
    query_timeout: 10000,
    idleTimeoutMillis: 10000,
    max: 3,
    min: 0,
    allowExitOnIdle: true,
    statement_timeout: 10000,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🔄 Aplicando migración de username...\n');

    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '..', 'prisma', 'migrations', '0_init', 'migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Ejecutando migración SQL...\n');

    // Ejecutar la migración SQL
    await prisma.$executeRawUnsafe(migrationSQL);

    console.log('✅ Migración aplicada exitosamente!\n');

    // Verificar que la columna username existe
    console.log('🔍 Verificando columna username...');
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'username'
    `;

    if (result.length > 0) {
      console.log('✅ Columna username encontrada:', result[0]);
    } else {
      console.log('❌ Columna username no encontrada');
    }

    // Verificar índice único
    console.log('🔍 Verificando índice único de username...');
    const indexResult = await prisma.$queryRaw`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'User' AND indexname = 'User_username_key'
    `;

    if (indexResult.length > 0) {
      console.log('✅ Índice único encontrado:', indexResult[0].indexname);
    } else {
      console.log('❌ Índice único no encontrado');
    }

    console.log('\n🎉 Migración completada! El campo username ya está disponible.');

  } catch (error) {
    console.error('❌ Error aplicando migración:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

applyMigration();