Quiero que realices una mejora avanzada de la aplicación, enfocada principalmente en:

experiencia de usuario (UX)
interfaz visual (UI)
velocidad de interacción
análisis de datos

La app ya funciona correctamente a nivel base, pero sigue siendo poco práctica y visualmente poco optimizada.

⚠️ IMPORTANTE:
No quiero cambios superficiales.
Quiero una mejora real en cómo se USA la app.

🎯 1. REDISEÑO DE INTERACCIÓN (PRIORIDAD ALTA)
PROBLEMA ACTUAL

Los objetivos:

ocupan demasiado espacio vertical
requieren demasiado esfuerzo visual
no son rápidos de usar
SOLUCIÓN

Rediseñar completamente el componente de objetivo diario:

NUEVO FORMATO (COMPACTO)

Cada objetivo debe verse como una fila compacta tipo:

icono
nombre
input (toggle o número)
puntos dinámicos (opcional)
EJEMPLO UX:

Boolean:
[🔥] Leer → [ toggle ]

Numeric:
[🏃] Correr → [-] 3 [+]

REGLAS:
reducir altura de cada objetivo al mínimo
permitir ver muchos objetivos sin scroll excesivo
interacción en 1 clic (sin fricción)
🌙 2. MODO OSCURO (DARK MODE)

Implementar sistema de tema:

light / dark
toggle persistente (localStorage)
REQUISITOS:
usar Tailwind con clases dark:
definir paleta consistente
no solo invertir colores → diseñar ambos modos
🎨 3. ICONOS Y COLORES EN OBJETIVOS

Agregar a cada Goal:

icon (string o enum)
color (string)
UI:
selector de iconos (mínimo 10 opciones predefinidas)
selector de color (palette simple)
EJEMPLOS:
📚 lectura (azul)
🏃 ejercicio (verde)
🚬 cigarrillos (rojo)

Mostrar icono y color en:

dashboard
historial
📅 4. CALENDARIO INTERACTIVO

Agregar una vista tipo calendario con:

MODOS:
diario
semanal
mensual
anual
FUNCIONALIDAD:
cada día muestra:
score
estado (color según resultado)
click en un día → ver detalle
navegación fluida
📊 5. GRÁFICOS Y ANALÍTICAS

Agregar nueva sección: "Analytics"

GRÁFICOS MÍNIMOS:
score por día (línea)
comparación semanal
promedio mensual
FILTROS:
rango de fechas
tipo de objetivo
objetivos específicos

Usar:

Recharts o similar
✏️ 6. EDICIÓN DE CUALQUIER DÍA
PROBLEMA:

Error al editar días futuros/pasados

SOLUCIÓN:
permitir edición sin restricciones (modo testing)
asegurar persistencia correcta
recalcular score automáticamente
⚡ 7. MEJORAS DE EXPERIENCIA
IMPLEMENTAR:
optimistic UI (respuesta inmediata al usuario)
feedback visual:
animaciones leves
cambios de color
estados claros:
loading
success
error
🧠 8. MEJORAS DE DISEÑO
OBJETIVO:

Que la app se sienta:

moderna
limpia
profesional
APLICAR:
mejor uso de spacing
tipografía jerárquica
bordes suaves
sombras sutiles
evitar bloques grandes innecesarios
🧱 9. ESCALABILIDAD

Preparar para futuro:

sistema de iconos extensible
sistema de colores reutilizable
componentes reutilizables
📦 OUTPUT ESPERADO
Rediseño completo de objetivos (compactos)
Dark mode funcional
Sistema de iconos y colores
Vista calendario interactiva
Sección de analytics con gráficos
Corrección de edición de fechas
Mejora visual general
Código limpio, modular y escalable
⚠️ REGLAS
no romper lógica existente
no hardcodear valores
mantener tipado fuerte
priorizar UX real sobre complejidad técnica

Podés reorganizar componentes, estilos y lógica si es necesario.

Prefiero una mejora profunda aunque implique cambios grandes.