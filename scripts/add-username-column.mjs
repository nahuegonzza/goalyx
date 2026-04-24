import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function addUsernameColumn() {
  try {
    console.log('🔄 Agregando columna username a la tabla User...\n');

    // Agregar la columna username
    console.log('📄 Agregando columna username...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "username" TEXT;
    `);

    console.log('📄 Creando índice único para username...');
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username") WHERE "username" IS NOT NULL;
    `);

    console.log('✅ Columna username agregada exitosamente!\n');

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

    console.log('\n🎉 Columna username agregada correctamente! Ya puedes verificar disponibilidad de usernames.');

  } catch (error) {
    console.error('❌ Error agregando columna username:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

addUsernameColumn();