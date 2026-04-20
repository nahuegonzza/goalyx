Quiero que hagas un análisis profundo y una corrección completa de la arquitectura actual del proyecto, porque actualmente está roto en producción (Vercel) debido a una mala configuración de Prisma + Supabase.

🚨 PROBLEMA ACTUAL

El deploy falla con este error:

Prisma schema validation error (P1012)
The datasource property url is no longer supported in schema files
Error ocurre durante prisma generate en Vercel build

Además:

Supabase Auth funciona correctamente (login/register OK)
Pero todas las queries a la base de datos fallan
prisma.goal.findMany() devuelve error 500
No se pueden cargar objetivos ni datos de usuario
🧠 CONTEXTO IMPORTANTE

Actualmente el proyecto tiene una mezcla inconsistente de:

Prisma configurado parcialmente en modo nuevo (prisma.config.ts aparece en logs)
schema.prisma todavía usando configuración antigua (url = env("DATABASE_URL"))
Supabase PostgreSQL como base de datos
Vercel serverless environment
Conexión directa y pooler mezclados o mal configurados
❗ OBJETIVO FINAL

Quiero que dejes el proyecto:

👉 funcionando en producción en Vercel
👉 con Prisma correctamente configurado (sin errores de schema)
👉 conectado correctamente a Supabase PostgreSQL (pooler)
👉 con migraciones funcionando correctamente
👉 sin errores de conexión ni en build ni en runtime

🔧 TAREAS QUE TENÉS QUE HACER
Detectar si el proyecto está usando Prisma "nuevo config mode" o Prisma clásico
Unificar la configuración (NO puede haber mezcla de ambos sistemas)
Corregir el schema.prisma para que sea válido según la versión correcta de Prisma
Corregir o eliminar prisma.config.ts si está rompiendo compatibilidad
Asegurar que DATABASE_URL use Supabase Pooler correctamente para Vercel
Asegurar que DIRECT_URL esté correctamente configurado para migraciones
Verificar que Prisma Client se inicializa correctamente
Eliminar cualquier configuración incompatible con Vercel serverless
Validar que prisma generate y prisma migrate deploy funcionen en build
Dejar el proyecto en estado estable y deployable
⚠️ RESTRICCIONES
No quiero soluciones parciales
No quiero hacks temporales
No quiero mezcla de versiones de Prisma
Quiero una configuración limpia y estándar de producción
🎯 RESULTADO ESPERADO

Al final debe cumplirse:

vercel build funciona sin errores
Prisma genera correctamente el client
Conexión a Supabase funciona con pooler
findMany() y queries funcionan en producción
No hay errores de datasource ni schema validation
💡 IMPORTANTE

Si detectas que Prisma está en una versión incompatible o experimental, debes:
👉 normalizarlo a una versión estable compatible con Next.js + Vercel + Supabase

Si necesitás simplificar la arquitectura (por ejemplo eliminar Prisma y usar Supabase client directo), puedes proponerlo, pero primero intenta arreglar la configuración actual.