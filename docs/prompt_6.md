Quiero que realices una mejora profunda, corrección de errores y refactorización de la aplicación actual (Next.js + Prisma + PostgreSQL), que ya está funcionando.

⚠️ IMPORTANTE:

* Podés tomarte TODO el tiempo necesario
* Quiero que analices el código completo antes de modificar
* Quiero que verifiques errores constantemente mientras desarrollás
* Tenés libertad absoluta para modificar cualquier parte del sistema (frontend, backend, schema, lógica)
* Prioridad máxima en estabilidad, UX real y coherencia del sistema
* NO quiero soluciones rápidas ni parches

---

# 🧠 CAMBIO DE ENFOQUE (MUY IMPORTANTE)

La app debe ser completamente:

👉 GOAL-DRIVEN (centrada en objetivos)

NO event-driven.

El usuario interactúa directamente con objetivos, no con eventos manuales.

---

# 🐞 ERRORES CRÍTICOS A CORREGIR

## 1. Booleanos incompletos

Problema:

* pointsIfFalse no aparece o no se puede editar correctamente

Solución:

* permitir editar SIEMPRE:

  * pointsIfTrue
  * pointsIfFalse (opcional)
* persistir correctamente en DB
* reflejar en UI correctamente

---

## 2. Puntos negativos

Problema:

* no se pueden usar correctamente

Solución:

* permitir valores negativos en:

  * boolean
  * numeric
* validar correctamente inputs
* reflejar impacto en score

---

## 3. Calendario roto (CRÍTICO)

Problemas:

* al abrir vista mensual se agrega una "M" infinita
* el calendario se rompe visualmente
* al hacer click en días se desordena la semana
* lógica de "diario" rompe el calendario

Solución:

* eliminar completamente la lógica incorrecta
* reconstruir el calendario correctamente

Requisitos:

* semana SIEMPRE:
  domingo → sábado
* navegación:
  semana anterior / siguiente
  mes anterior / siguiente
  año anterior / siguiente
* click en día:
  NO debe reordenar nada
  solo mostrar detalle

---

## 4. Layout del calendario

* separar calendario de analytics
* calendario accesible desde icono (arriba)
* NO mezclar con otras vistas

---

## 5. UI rota (colores)

Problema:

* colores transparentes o invisibles

Solución:

* arreglar renderizado de colores
* asegurar contraste correcto
* mostrar color real SIEMPRE

---

## 6. Inputs y layout inconsistente

Problemas:

* alturas distintas
* inputs desalineados
* selector de iconos demasiado grande

Solución:

* unificar alturas
* reducir tamaño de selector de iconos
* mejorar simetría general

---

## 7. Orden de objetivos

Agregar:

* drag & drop o sistema simple para ordenar objetivos manualmente
* persistir orden

---

## 8. Objetivos (UX)

Mejorar:

* mostrar color también en listado de objetivos
* botones editar/eliminar:
  SOLO iconos (sin texto)

---

## 9. Analytics mal estructurado

Problemas:

* "resumen" permite filtrar por objetivo (incorrecto)
* "por objetivo" duplicación de lógica
* inputs desalineados

Solución:

* separar correctamente:

  1. Resumen → global
  2. Por objetivo → SOLO selección de objetivo
* corregir filtros
* unificar layout

---

# ⚙️ NUEVA SECCIÓN: CONFIGURACIÓN

Agregar sección accesible con icono de ⚙️

Debe incluir:

* toggle light / dark mode
* persistencia (localStorage)

Preparar para futuras configuraciones

---

# 🧩 SISTEMA DE MÓDULOS (BASE, SIN COMPLEJIDAD)

Crear sección nueva: "Módulos"

Funcionalidad:

* listar módulos disponibles
* permitir:
  activar / desactivar módulos

Estructura:

Module:

* id
* name
* enabled

NO implementar lógica compleja aún.

---

## 🧪 EJEMPLO MÓDULO: "Ciclo de Sueño"

Agregar como ejemplo funcional mínimo:

Inputs:

* hora de dormir
* hora de despertar

Calcular:

* horas dormidas

Lógica de puntos:

Si ideal = 8 horas:

* 8h → puntos completos
* 7h o 9h → mitad de puntos
* 6h o 10h → 0
* 5h o 11h → negativo

Hacer esto configurable.

---

# 📊 ESTADÍSTICAS (SIN GRÁFICOS)

Agregar:

* total del día
* total semanal
* total mensual

Comparaciones:

* vs día anterior
* vs semana anterior
* vs mes anterior

---

# 🎨 UI / UX GENERAL

* usar iconos en navegación (en lugar de texto largo)
* hacer botones más compactos
* mejorar densidad visual
* mantener consistencia en toda la app

---

# 🧱 CÓDIGO

* mantener TypeScript fuerte
* evitar duplicación
* separar:
  lógica / UI / datos
* reutilizar componentes
* evitar hacks

---

# 🚀 OUTPUT ESPERADO

Quiero:

* bugs corregidos (calendar, boolean, colores)
* sistema de objetivos sólido
* UI consistente
* navegación por iconos
* sección configuración funcional
* sistema base de módulos listo
* ejemplo funcional de módulo de sueño
* estadísticas correctas
* código limpio y escalable

---

⚠️ PRIORIDAD:

1. estabilidad
2. coherencia lógica
3. UX real

No priorizar estética sobre funcionalidad.

Si hace falta refactorizar fuerte, hacerlo.
