Quiero que realices una refactorización profunda y mejora integral de la aplicación existente construida con Next.js, Prisma y PostgreSQL.

La app ya funciona, pero presenta problemas de lógica, UX/UI y escalabilidad que deben resolverse correctamente, no con parches.

⚠️ IMPORTANTE:
No quiero soluciones rápidas ni superficiales.
Podés tomarte el tiempo necesario para analizar, reorganizar y mejorar todo lo necesario.

🐞 ERRORES A CORREGIR (PRIORIDAD ALTA)
1. Error de fechas (CRÍTICO)

Actualmente los registros (GoalEntry) se están guardando en el día incorrecto (generalmente el día anterior).

Esto probablemente es un problema de:

manejo de timezone
uso de new Date() vs fechas normalizadas
conversión con toISOString()
SOLUCIÓN ESPERADA:
Implementar manejo correcto de fechas basado en día local del usuario
Normalizar fechas a formato tipo YYYY-MM-DD sin depender de timezone UTC
Evitar desfases por toISOString()
Crear helper centralizado para manejo de fechas (ej: getLocalDateString())
2. Error en edición de objetivos booleanos

Actualmente:

Se puede editar pointsIfTrue
NO se puede editar correctamente pointsIfFalse
SOLUCIÓN:
Corregir lógica de formulario y persistencia
Asegurar que ambos valores se puedan editar y guardar
Validar correctamente valores opcionales
🧠 MEJORAS DE UX/UI (MUY IMPORTANTE)

La UI actual funciona pero es:

demasiado cargada
poco jerárquica
poco intuitiva para uso diario
OBJETIVO:

Hacer la app:

más simple
más rápida de usar
más limpia visualmente
centrada en interacción diaria
🏠 REDISEÑO DEL DASHBOARD (HOME)
PROBLEMA ACTUAL:

Todo está en una sola pantalla (interacción, creación, comparaciones, etc.)

SOLUCIÓN:

Convertir el inicio en un dashboard minimalista con:

SOLO:
lista de objetivos del día (interacción rápida)
score del día
feedback visual claro
MOVER A OTRAS VISTAS:
comparaciones
historial
creación/edición de objetivos
🧭 NAVEGACIÓN

Implementar navegación clara:

Dashboard (inicio)
Historial
Objetivos (gestión)
Comparaciones

Puede ser:

sidebar
top navbar
🎯 INTERACCIÓN CON OBJETIVOS
PROBLEMA:

Los objetivos ocupan demasiado espacio y son poco prácticos

SOLUCIÓN:

Rediseñar cada objetivo como:

compacto
rápido de usar
visualmente claro
Ejemplo:

Boolean:

toggle o checkbox grande y claro

Numeric:

input compacto + botones +/- opcionales
📅 HISTORIAL MEJORADO
NUEVAS FUNCIONALIDADES:
poder seleccionar cualquier día
ver detalles de ese día
editar entradas de días pasados
🔎 FILTROS

Agregar:

selector de fecha
navegación por días (prev / next)
filtro rápido
✏️ EDICIÓN DE DÍAS PASADOS

Implementar:

edición de GoalEntries de cualquier día
persistencia correcta
recalculo automático del score
🎨 MEJORAS VISUALES

Objetivo:

diseño más moderno
más aire visual
menos “bloques pesados”
Aplicar:
mejor uso de spacing (Tailwind)
jerarquía tipográfica
colores más suaves
feedback visual (hover, estados activos)
⚙️ MEJORAS DE ARQUITECTURA
1. Separación clara

Separar mejor:

lógica de UI
lógica de negocio
acceso a datos
2. Helpers reutilizables

Crear:

helper de fechas
helper de cálculo de score
validaciones
3. Tipado fuerte

Evitar:

string genéricos donde hay enums

Corregir problemas como:

GoalStatus
tipos inconsistentes entre DB y frontend
4. Performance
evitar renders innecesarios
optimizar fetch de datos
usar memoización si aplica
🚀 MEJORAS EXTRA (SI HAY TIEMPO)
Animaciones suaves (Framer Motion opcional)
Feedback inmediato al interactuar (optimistic UI)
Mejor manejo de estados de carga
📦 OUTPUT ESPERADO

Quiero que generes:

Refactor de lógica de fechas
Corrección de bugs mencionados
Rediseño del dashboard
Nuevos componentes UI más compactos
Sistema de navegación
Vista de historial editable
Mejora visual general
Código limpio, modular y tipado
⚠️ REGLAS
No romper funcionalidades existentes
No hardcodear lógica
Mantener escalabilidad
Priorizar claridad del código

Si necesitás reestructurar componentes, carpetas o lógica, hacelo.

Prefiero una solución sólida aunque sea más extensa.