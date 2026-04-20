const { execSync } = require('child_process');

const { DATABASE_URL, DIRECT_DATABASE_URL } = process.env;
const isPostgresUrl = (value) => typeof value === 'string' && /^(postgres|postgresql):\/\//i.test(value);

if (!DIRECT_DATABASE_URL) {
  console.log('[prisma] DIRECT_DATABASE_URL is not set. Skipping prisma migrate deploy.');
  process.exit(0);
}

if (!isPostgresUrl(DATABASE_URL)) {
  console.log('[prisma] DATABASE_URL is not a PostgreSQL URL. Skipping prisma migrate deploy.');
  process.exit(0);
}

if (!isPostgresUrl(DIRECT_DATABASE_URL)) {
  console.log('[prisma] DIRECT_DATABASE_URL is not a PostgreSQL URL. Skipping prisma migrate deploy.');
  process.exit(0);
}

console.log('[prisma] DIRECT_DATABASE_URL found. Running prisma migrate deploy...');

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} catch (error) {
  console.error('[prisma] prisma migrate deploy failed.');
  process.exit(error.status || 1);
}
