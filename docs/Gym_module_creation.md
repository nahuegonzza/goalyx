Quiero que desarrolles un nuevo módulo completo llamado “Gym” para mi aplicación Goalyx.

IMPORTANTE:
Antes de empezar:

* Analizá toda la app existente completa.
* Entendé la arquitectura, componentes reutilizables, patrones de diseño, estilos, naming conventions, estructura de carpetas, sistema de estados, navegación, hooks, tipos, animaciones y responsive design.
* El nuevo módulo DEBE sentirse completamente nativo dentro de la app.
* Respetá totalmente la estética visual actual.
* Reutilizá componentes existentes siempre que sea posible.
* Revisá toda la app antes de finalizar para asegurarte de que no haya errores, imports rotos, problemas responsive, conflictos de tipos, problemas de rendimiento ni inconsistencias visuales.

════════════════════════════
OBJETIVO GENERAL
════════════════════════════

Crear un módulo extremadamente completo de seguimiento de gimnasio y entrenamiento físico.

El módulo debe permitir:

* Registrar asistencia diaria.
* Registrar entrenamientos completos.
* Gestionar rutinas.
* Ver progreso físico.
* Comparar rendimiento.
* Analizar estadísticas.
* Tener experiencia mobile y desktop premium.
* Integrarse perfectamente con el resto de módulos existentes.

════════════════════════════
NAVBAR E INTEGRACIÓN
════════════════════════════

Agregar el acceso al módulo Gym en la navbar.

Desktop:

* Debe ubicarse justo al lado del botón/navbar de “Gestión Universitaria”.
* Debe usar EXACTAMENTE la misma lógica visual y de comportamiento:

  * hover
  * active state
  * animaciones
  * tooltips
  * responsive logic
  * tamaño
  * spacing
  * transiciones
  * glassmorphism/shadows si existen
  * sistema de selección actual

Mobile:

* Debe ocupar el espacio vacío que quedó en la navbar móvil.
* Debe ubicarse completamente a la derecha.
* Debe respetar EXACTAMENTE la lógica de visualización de Gestión Universitaria.

Icono:
Usar:
public/navbar_icons/flag_icon

════════════════════════════
FUNCIONALIDADES PRINCIPALES
════════════════════════════

1. ASISTENCIA AL GYM

* Poder marcar si fui o no fui al gimnasio cada día.
* Calendario visual mensual.
* Estadísticas de asistencia.
* Rachas consecutivas.
* Porcentaje mensual.
* Objetivo semanal de asistencia.
* Días configurables de entrenamiento.
* Poder configurar qué días normalmente entreno.
* Mostrar días esperados vs cumplidos.

2. REGISTRO DE SESIONES
   Cada día debe permitir:

* Hora de entrada.
* Hora de salida.
* Duración automática.
* Notas del entrenamiento.
* Nivel de energía.
* Estado de ánimo post entrenamiento.
* Calidad del entrenamiento.
* Fatiga.
* Dolor muscular.
* Peso corporal del día.
* Cantidad de agua consumida.
* Cardio realizado.

3. EJERCICIOS
   Sistema completo de ejercicios reutilizables.

Cada ejercicio debe tener:

* Nombre.
* Grupo muscular.
* Descripción opcional.
* Tipo:

  * fuerza
  * hipertrofia
  * cardio
  * movilidad
  * calistenia
* Imagen o ícono opcional.
* Ejercicio favorito.
* Historial completo.

Grupos musculares:

* Pecho
* Espalda
* Hombros
* Bíceps
* Tríceps
* Antebrazos
* Piernas
* Cuádriceps
* Femorales
* Glúteos
* Gemelos
* Abdominales
* Core
* Trapecio
* Lumbar
* Full Body
* Cardio
* Movilidad

Permitir:

* Crear ejercicios custom.
* Editar ejercicios.
* Eliminar ejercicios.
* Buscar ejercicios.
* Filtrar por grupo muscular.

4. ENTRENAMIENTO DEL DÍA
   Poder agregar múltiples ejercicios al día.

Cada ejercicio dentro del entrenamiento debe permitir:

* Series.
* Repeticiones.
* Peso.
* Duración.
* Distancia.
* Tiempo de descanso.
* RPE / dificultad.
* Notas.
* Marcar PR (personal record).
* Marcar ejercicio completado.

Cada serie debe poder registrarse individualmente.

Ejemplo:
Press banca:

* Serie 1 → 80kg x 8
* Serie 2 → 80kg x 7
* Serie 3 → 75kg x 10

════════════════════════════
COMPARACIONES Y PROGRESO
════════════════════════════

Agregar análisis avanzados:

* Comparación con semana anterior.
* Comparación con mes anterior.
* Evolución de fuerza.
* Evolución de volumen total.
* Evolución por ejercicio.
* Historial completo.
* Récords personales.
* Gráficos.
* Tendencias.
* Detección de mejora/empeoramiento.

Mostrar:

* Volumen total levantado.
* Peso máximo.
* Mejor sesión.
* Tiempo promedio entrenando.
* Grupo muscular más entrenado.
* Días más activos.

════════════════════════════
RUTINAS
════════════════════════════

Crear sistema completo de rutinas.

Cada rutina debe permitir:

* Nombre.
* Descripción.
* Color.
* Objetivo.
* Días asignados.
* Lista de ejercicios.
* Orden configurable.

Tipos de rutina:

* Push Pull Legs
* Upper Lower
* Full Body
* Arnold Split
* Personalizada

Funcionalidades:

* Duplicar rutinas.
* Importar/exportar rutinas.
* Activar rutina actual.
* Auto completar ejercicios del día según rutina asignada.
* Poder reordenar ejercicios drag & drop.
* Templates predeterminados.

════════════════════════════
EXPERIENCIA VISUAL
════════════════════════════

Quiero una experiencia MUY moderna y premium.

Agregar:

* Animaciones suaves.
* Transiciones fluidas.
* Microinteracciones.
* Barras de progreso.
* Heatmaps de asistencia.
* Calendarios interactivos.
* Gráficos modernos.
* Tarjetas animadas.
* Responsive perfecto.
* Excelente UX mobile.

Todo debe respetar completamente la estética actual de Goalyx.

════════════════════════════
ESTADÍSTICAS Y DASHBOARD
════════════════════════════

Agregar dashboard principal con:

* Asistencia semanal.
* Resumen mensual.
* Tiempo entrenado.
* Volumen total.
* PRs recientes.
* Próxima rutina.
* Estado actual.
* Progreso hacia objetivos.
* Streak actual.
* Últimos entrenamientos.

════════════════════════════
OBJETIVOS
════════════════════════════

Sistema de objetivos:

* Objetivo de frecuencia semanal.
* Objetivo de peso corporal.
* Objetivo de fuerza.
* Objetivo de volumen.
* Objetivos personalizados.

════════════════════════════
EXTRAS IMPORTANTES
════════════════════════════

Agregar también:

* Sistema de favoritos.
* Quick add para ejercicios frecuentes.
* Copiar entrenamiento anterior.
* Sugerencias automáticas.
* Descanso automático entre series.
* Timer integrado.
* Modo rápido para registrar entrenamientos.
* Persistencia correcta de datos.
* Optimización de rendimiento.
* Lazy loading si es necesario.
* Estados vacíos bien diseñados.
* Skeleton loaders.
* Manejo completo de errores.
* Accesibilidad.
* Dark mode consistente.
* Buen tipado TypeScript.
* Código modular y escalable.

════════════════════════════
MUY IMPORTANTE
════════════════════════════

Antes de terminar:

* Revisar toda la app.
* Verificar consistencia visual total.
* Verificar responsive completo.
* Verificar errores TypeScript.
* Verificar imports.
* Verificar navegación.
* Verificar estados.
* Verificar performance.
* Verificar que no rompa módulos existentes.
* Verificar integración total con la arquitectura actual.

El resultado final debe sentirse como si el módulo hubiera sido parte original de Goalyx desde el inicio.
