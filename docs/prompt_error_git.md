Estoy teniendo problemas al hacer deploy de mi aplicación en Next.js 14 (App Router) con Prisma en Vercel.

Durante el build aparecen errores como:

* "Failed to collect page data for /api/events"
* "Failed to collect page data for /api/goals/[goalId]"
* "Failed to collect page data for /api/goalEntries"

Esto indica que Next.js está intentando ejecutar mis API routes durante el build, lo cual no debería ocurrir.

## 🧠 CONTEXTO DEL PROBLEMA

La aplicación usa:

* Next.js 14 (App Router)
* API Routes en `/app/api/.../route.ts`
* Prisma como ORM
* PostgreSQL

El problema ocurre porque:

1. Next.js intenta analizar y ejecutar código de las API routes en tiempo de build.
2. Algunas de mis rutas contienen lógica que usa Prisma fuera de los handlers (`GET`, `POST`, etc.), o estructuras que hacen que el código se ejecute al importarse.
3. Prisma no puede ejecutarse correctamente en build time → rompe el deploy.

## 🎯 OBJETIVO

Quiero que refactorices TODAS las API routes para que:

* NO ejecuten lógica en el top-level del archivo
* TODO acceso a Prisma esté dentro de funciones `export async function GET/POST/PATCH/DELETE`
* Sean 100% compatibles con Next.js App Router en entorno de producción

## ⚙️ REGLAS IMPORTANTES

1. En cada archivo `route.ts`:

Agregar al inicio:

```ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
```

2. NO debe existir ningún uso de Prisma fuera de funciones.

❌ Incorrecto:

```ts
const data = await prisma.goal.findMany();
```

✅ Correcto:

```ts
export async function GET() {
  const data = await prisma.goal.findMany();
  return NextResponse.json(data);
}
```

3. Asegurar que TODAS las rutas sigan este patrón:

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await prisma.model.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
```

4. Para rutas dinámicas (`[goalId]`), usar correctamente `params`:

```ts
export async function GET(
  req: Request,
  { params }: { params: { goalId: string } }
) {
  const goal = await prisma.goal.findUnique({
    where: { id: params.goalId },
  });

  return NextResponse.json(goal);
}
```

## 🔍 COSAS A REVISAR

* Imports que ejecuten lógica automáticamente
* Funciones async fuera de handlers
* Uso incorrecto de `params`
* Código compartido que use Prisma al importarse
* Cualquier side-effect en top-level

## 🚀 RESULTADO ESPERADO

* Todas las API routes deben ser seguras para build
* No debe ejecutarse Prisma en build time
* El deploy en Vercel debe completarse sin errores
* Mantener tipado con TypeScript
* Código limpio, modular y escalable

## EXTRA (si podés mejorar)

* Centralizar lógica repetida
* Mejorar manejo de errores
* Asegurar consistencia entre endpoints
* Preparar base para futuros módulos (sleep, finance, etc.)

No simplifiques. Quiero una refactorización sólida y correcta para producción.
