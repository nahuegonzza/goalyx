Quiero que generes la estructura inicial completa de una aplicación web moderna basada en un sistema personal de seguimiento de hábitos, acciones y métricas, inspirado en múltiples hojas de cálculo avanzadas interconectadas.

La aplicación debe ser modular, escalable y preparada para crecer en múltiples módulos independientes (como "plugins" o "DLCs"), pero todos conectados a un núcleo central.

## 🧠 CONCEPTO PRINCIPAL

El sistema gira en torno a un "motor de puntuación de vida":

* Los usuarios registran eventos diarios (acciones realizadas)
* Cada evento genera o resta puntos
* Las reglas de puntuación son configurables y pueden ser complejas (ej: penalización progresiva)
* El sistema calcula un score diario en base a todas las acciones

## 🧩 ARQUITECTURA GENERAL

Separar en:

### 1. CORE (obligatorio)

* Usuarios
* Objetivos / hábitos
* Eventos (acciones realizadas)
* Reglas de puntuación
* Cálculo de puntos
* Score diario

### 2. MÓDULOS (extensibles, no obligatorios)

Cada módulo puede funcionar solo pero también integrarse al core:

* Módulo de hábitos manuales (check diario)
* Módulo de finanzas (gastos e ingresos)
* Módulo de gimnasio (rutinas, pesos, progreso)
* Módulo de sueño (horarios, calidad)
* Módulo de trabajo (ej: tracking tipo Uber)

Todos los módulos deben poder enviar eventos al CORE.

## 🔗 SISTEMA DE EVENTOS

Toda acción debe convertirse en un evento con estructura tipo:

* tipo_evento
* valor
* fecha
* metadata (json)

Ejemplo:

* "cigarrillos_fumados": 5
* "dinero_gastado": 20000
* "horas_sueno": 6

## ⚙️ SISTEMA DE REGLAS

Las reglas deben permitir:

* sumar o restar puntos
* lógica condicional
* progresión (ej: primeros 3 -0.5, resto -1)
* configuración por usuario

## 🗄️ BASE DE DATOS

Usar PostgreSQL.

Definir modelos como:

* users
* goals (objetivos)
* events
* rules
* scores
* modules (para extensibilidad)

Incluir relaciones claras.

## 🌐 STACK TECNOLÓGICO

Usar:

* Frontend: Next.js + React + TypeScript
* Backend: API Routes de Next.js o estructura separada
* Base de datos: PostgreSQL
* ORM: Prisma
* Estilos: Tailwind CSS

## 📱 COMPATIBILIDAD MOBILE

Preparar la app como PWA (Progressive Web App):

* manifest.json
* service worker básico

## 🧱 ESTRUCTURA DEL PROYECTO

Generar estructura completa tipo:

/app
/components
/modules
/core
/lib
/prisma
/pages o /app (Next.js)
/api
/hooks
/types

## 📊 FUNCIONALIDADES INICIALES (MVP)

Implementar:

1. Crear objetivos/hábitos
2. Registrar eventos manuales
3. Sistema básico de reglas
4. Cálculo de score diario
5. Vista de dashboard simple

## 🎯 IMPORTANTE

* Código limpio y modular
* Separación clara entre core y módulos
* Preparado para escalar
* Tipado fuerte (TypeScript)
* Comentarios explicando decisiones

## 🚀 OUTPUT ESPERADO

Generar:

1. Estructura de carpetas
2. Archivos iniciales
3. Configuración de proyecto
4. Esquema Prisma
5. Ejemplo de endpoints API
6. Componentes base de UI
7. Ejemplo de cálculo de puntos

No simplificar demasiado. Prefiero una base completa aunque sea más extensa.
