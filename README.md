# Objetives App

Aplicación inicial para seguimiento personal de hábitos, eventos, reglas de puntuación y score diario.

## Arquitectura

- `app/` - rutas y UI principal de Next.js App Router
- `components/` - componentes UI reutilizables
- `core/` - lógica del motor, cálculo de reglas y score diario
- `modules/` - módulos extendibles (hábitos, finanzas, sueño, gimnasio, trabajo)
- `lib/` - utilidades compartidas y cliente Prisma
- `prisma/` - esquema de datos y migraciones
- `types/` - definiciones TypeScript compartidas
- `hooks/` - hooks de frontend

## Stack

- Next.js + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- PWA con `manifest.json` y service worker básico
- Módulos extensibles: Hábitos, Finanzas, Gimnasio, Sueño, Trabajo, Agua

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:migrate`

## Nuevas Features

- **Módulo Agua**: Rastrea consumo diario con bonus por cumplir meta
- **Exportar Datos**: Descarga respaldo completo en JSON desde Ajustes
- **Validación Mejorada**: APIs con validación de tipos de datos
- **UI Mejorada**: Gestión de objetivos unificada, calendario con recarga automática

## Primeros pasos

1. Copia `.env.example` a `.env.local`
2. Ajusta `DATABASE_URL`
3. Ejecuta `npm install`
4. Ejecuta `npm run prisma:migrate`
5. Ejecuta `npm run dev`
