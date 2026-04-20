🚨 PROBLEMA

El build en Vercel se bloquea o puede bloquearse en:

prisma migrate deploy

Aunque Prisma generate funciona correctamente.

CONTEXTO
Next.js en Vercel
Supabase PostgreSQL
Prisma configurado correctamente
Uso de connection pooler (6543)
Migraciones incluidas en script de build
OBJETIVO

Eliminar completamente el bloqueo del build y hacer el deploy estable.

TAREA PRINCIPAL

Modificar el script de build para NO ejecutar migraciones en Vercel.

CAMBIO OBLIGATORIO

Reemplazar:

"build": "prisma migrate deploy && next build"

por:

"build": "next build"
JUSTIFICACIÓN
Vercel es serverless → no ideal para migraciones
Supabase pooler causa bloqueos en migrate
Migraciones deben ejecutarse manualmente o en entorno controlado
OPCIONAL

Agregar script separado:

"migrate": "prisma migrate deploy"

para correr migraciones manualmente cuando sea necesario

REGLAS
No ejecutar migraciones en build
No romper Prisma Client
No afectar conexión a DB en runtime
RESULTADO ESPERADO
build termina rápido (1–2 minutos)
no se cuelga nunca más
deploy estable
app funcional