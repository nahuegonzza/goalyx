Quiero que analices y soluciones un problema crítico de conexión entre Prisma, Supabase y Vercel.

CONTEXTO

La aplicación es un sistema de objetivos (Next.js) desplegado en Vercel.

Supabase se usa como backend (Auth funciona correctamente)
Prisma se usa para acceder a la base de datos PostgreSQL
El login/registro funciona correctamente con Supabase Auth
El problema aparece cuando se intentan cargar datos desde la base de datos
ERROR ACTUAL

Frontend muestra:

Error cargando módulos: HTTP 500
Error cargando objetivos:
PrismaClientInitializationError:
Can't reach database server at db.oknknckrwgnuwmrqrxnf.supabase.co
en prisma.goal.findMany()

También ocurre al intentar acceder a datos del usuario en configuración.

COMPORTAMIENTO ACTUAL
Supabase Auth funciona (login/register OK)
No se pueden leer datos de la base de datos
No se muestran objetivos ni datos de usuario
Prisma falla en todas las queries
VARIABLES DE ENTORNO (Vercel)

NEXT_PUBLIC_SUPABASE_URL=https://oknknckrwgnuwmrqrxnf.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***
DATABASE_URL=postgresql://postgres:***@db.oknknckrwgnuwmrqrxnf.supabase.co:5432/postgres?sslmode=require

OBJETIVO

Quiero que:

Diagnostiques por qué Prisma no puede conectarse a Supabase PostgreSQL
Verifiques si el DATABASE_URL es correcto o si debe usarse pooler connection string de Supabase
Verifiques si falta configuración de Prisma en Vercel (runtime, env, etc.)
Confirmes si las tablas no existen o si falta ejecutar migraciones (prisma migrate)
Ajustes la arquitectura si es necesario (ej: reemplazar Prisma por Supabase client si aplica)
Hagas que la conexión a base de datos funcione correctamente en producción (Vercel)
CONDICIÓN IMPORTANTE

No quiero soluciones superficiales.

Puedes:

cambiar configuración de Prisma
cambiar estrategia de conexión
modificar schema si es necesario
proponer migraciones
o incluso reemplazar Prisma si es la causa del problema

Pero el objetivo final es:
👉 que findMany() y todas las queries funcionen correctamente en Vercel con Supabase

PRIORIDAD

Primero arreglar conexión DB → luego revisar queries.