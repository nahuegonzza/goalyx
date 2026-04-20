🚨 PROBLEMA CRÍTICO

El build en Vercel se queda colgado indefinidamente durante:

prisma migrate deploy

No tira error, pero no avanza durante más de 10+ minutos.

CONTEXTO
Next.js en Vercel (serverless)
Supabase PostgreSQL
Prisma ORM con prisma.config.ts
DATABASE_URL usa Supabase pooler (puerto 6543)
DIRECT_DATABASE_URL usa conexión directa (puerto 5432)
CAUSA

prisma migrate deploy está usando DATABASE_URL (pooler).

El pooler de Supabase (pgbouncer) NO soporta migraciones correctamente y hace que el proceso se quede colgado.

OBJETIVO

Separar correctamente:

Runtime (queries) → usar DATABASE_URL (pooler)
Migraciones → usar DIRECT_DATABASE_URL (conexión directa)

Evitar que el build se bloquee en Vercel.

TAREAS OBLIGATORIAS
Configurar Prisma para que use DIRECT_DATABASE_URL en migraciones
Asegurar que prisma migrate deploy NO use DATABASE_URL
Revisar prisma.config.ts y configurar correctamente datasource con:
url → DATABASE_URL (pooler)
directUrl → DIRECT_DATABASE_URL
Si Prisma moderno requiere configuración adicional, implementarla correctamente
Verificar que prisma generate siga funcionando
Evitar cualquier uso del pooler en procesos de migración
OPCIÓN ALTERNATIVA (SI LO ANTERIOR FALLA)

Modificar el script de build para:

NO ejecutar prisma migrate deploy en Vercel
dejar migraciones como proceso manual o externo

Ejemplo:

"build": "next build"

y remover:

prisma migrate deploy &&
REGLAS
NO usar pooler para migraciones
NO dejar el build colgado
NO romper la conexión en runtime
NO dejar configuración ambigua
RESULTADO ESPERADO
build termina normalmente (menos de 2–3 minutos)
prisma generate funciona
no hay procesos colgados
app deploya correctamente en Vercel
conexión a Supabase sigue funcionando en producción