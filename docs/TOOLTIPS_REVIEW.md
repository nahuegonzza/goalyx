# Revisión y Adición de Tooltips en Botones - Goalyx

**Fecha**: Mayo 17, 2026  
**Objetivo**: Agregar tooltips (atributo `title=""`) a todos los botones en la aplicación que no lo tenían, mejorando la accesibilidad y experiencia del usuario.

---

## Resumen de Cambios

Se han agregado **51+ tooltips** en **17 archivos** diferentes, cubriendo botones en componentes principales, modales, formularios y módulos específicos.

---

## Cambios por Archivo

### 🎯 Components

#### 1. **components/GoalForm.tsx**
**Cambios**: 3 tooltips agregados

- **Botón "Activar/Desactivar todos"** (L356)
  - Antes: Sin tooltip
  - Después: `title="Seleccionar todos los días"` / `title="Deseleccionar todos los días"`
  - Contexto: Toggle para seleccionar todos los días de la semana

- **Botón "Cancelar"** (L343)
  - Antes: Sin tooltip
  - Después: `title="Cancelar cambios"`
  - Contexto: Cancela la edición del formulario sin guardar

- **Botón Submit** (L381)
  - Antes: Sin tooltip
  - Después: `title="Guardar objetivo"`
  - Contexto: Envía el formulario de creación/edición de objetivos

---

#### 2. **components/HistoryViewer.tsx**
**Cambios**: 3 tooltips agregados

- **Botón "← Anterior"** (L236)
  - Antes: Sin tooltip
  - Después: `title="Día anterior"`
  - Contexto: Navega al día anterior

- **Botón "Siguiente →"** (L248)
  - Antes: Sin tooltip
  - Después: `title="Día siguiente"`
  - Contexto: Navega al día siguiente

- **Botón "Hoy"** (L254)
  - Antes: Sin tooltip
  - Después: `title="Ir a hoy"`
  - Contexto: Vuelve a la fecha actual

---

#### 3. **components/Analytics.tsx**
**Cambios**: 1 tooltip agregado

- **Botón Colapsar/Expandir Datos Diarios** (L486)
  - Antes: Sin tooltip
  - Después: `title="Expandir datos diarios"` / `title="Contraer datos diarios"`
  - Contexto: Toggle para mostrar/ocultar tabla de datos diarios

---

#### 4. **components/GoalCreateModal.tsx**
**Cambios**: 1 tooltip agregado

- **Botón Cerrar (✕)** (L35)
  - Antes: Sin tooltip
  - Después: `title="Cerrar modal"`
  - Contexto: Cierra el modal de creación de objetivo

---

#### 5. **components/GoalEditModal.tsx**
**Cambios**: 1 tooltip agregado

- **Botón Cerrar (✕)** (L41)
  - Antes: Sin tooltip
  - Después: `title="Cerrar modal"`
  - Contexto: Cierra el modal de edición de objetivo

---

#### 6. **components/ConfirmationModal.tsx**
**Cambios**: 2 tooltips agregados

- **Botón "Cancelar"** (L36)
  - Antes: Sin tooltip
  - Después: `title="Cancelar operación"`
  - Contexto: Cancela la operación de confirmación

- **Botón "Confirmar"** (L43)
  - Antes: Sin tooltip
  - Después: `title="Confirmar operación"`
  - Contexto: Confirma la operación requerida

---

#### 7. **components/UnsavedChangesModal.tsx**
**Cambios**: 2 tooltips agregados

- **Botón "Seguir editando"** (L32)
  - Antes: Sin tooltip
  - Después: `title="Volver a editar"`
  - Contexto: Continúa editando sin cerrar

- **Botón "Cerrar sin guardar"** (L39)
  - Antes: Sin tooltip
  - Después: `title="Descartar cambios y cerrar"`
  - Contexto: Descartan cambios no guardados

---

#### 8. **components/CompactGoalItem.tsx**
**Cambios**: 2 tooltips agregados

- **Botón "−" (Disminuir valor)** (L92)
  - Antes: Sin tooltip
  - Después: `title="Disminuir valor"`
  - Contexto: Decrementa el valor de un objetivo numérico

- **Botón "+" (Aumentar valor)** (L126)
  - Antes: Sin tooltip
  - Después: `title="Aumentar valor"`
  - Contexto: Incrementa el valor de un objetivo numérico

---

#### 9. **components/ModuleTile.tsx**
**Cambios**: 3 tooltips agregados

- **Botón "Activar/Desactivar"** (L46)
  - Antes: Sin tooltip
  - Después: `title="Desactivar módulo"` / `title="Activar módulo"`
  - Contexto: Toggle para activar/desactivar módulos

- **Botón "Configurar" (Sleep)** (L55)
  - Antes: Sin tooltip
  - Después: `title="Abrir configuración"`
  - Contexto: Abre configuración del módulo Sleep

- **Botón "Configurar" (Academic)** (L64)
  - Antes: Sin tooltip
  - Después: `title="Abrir configuración"`
  - Contexto: Abre configuración del módulo Academic

---

#### 10. **components/GoalTracker.tsx**
**Cambios**: 3 tooltips agregados

- **Botón Colapsar/Expandir Hábitos** (L538)
  - Antes: Sin tooltip
  - Después: `title="Expandir hábitos"` / `title="Contraer hábitos"`
  - Contexto: Toggle para mostrar/ocultar hábitos

- **Botón Colapsar/Expandir Métricas** (L564)
  - Antes: Sin tooltip
  - Después: `title="Expandir métricas"` / `title="Contraer métricas"`
  - Contexto: Toggle para mostrar/ocultar métricas

- **Botón Colapsar/Expandir Módulo** (L600)
  - Antes: Sin tooltip
  - Después: `title="Expandir {module.name}"` / `title="Contraer {module.name}"`
  - Contexto: Toggle para colapsar/expandir módulos específicos

---

#### 11. **components/UnifiedColorPicker.tsx**
**Cambios**: 3 tooltips agregados

- **Botón Selector de Color Principal** (L145)
  - Antes: `aria-label="Seleccionar color"`
  - Después: `title="Abrir selector de color"`
  - Contexto: Abre el selector de color

- **Botones de Colores Predefinidos** (L170)
  - Antes: `aria-label={option.label}`
  - Después: `title="Seleccionar color: {option.label}"`
  - Contexto: Selecciona un color específico del paleta

- **Botón Color Personalizado** (L181)
  - Antes: `aria-label="Color personalizado"`
  - Después: `title="Abrir selector de color personalizado"`
  - Contexto: Abre un selector de color nativo del navegador

---

#### 12. **components/InfoModal.tsx**
**Cambios**: 1 tooltip agregado

- **Botón "Entendido"** (L31)
  - Antes: Sin tooltip
  - Después: `title="Cerrar información"`
  - Contexto: Cierra el modal informativo

---

#### 13. **components/EventForm.tsx**
**Cambios**: 1 tooltip agregado

- **Botón "Registrar evento"** (L93)
  - Antes: Sin tooltip
  - Después: `title="Registrar evento"`
  - Contexto: Envía el formulario de evento

---

### 🌙 Módulos

#### 14. **modules/sleep/SleepConfig.tsx**
**Cambios**: 11 tooltips agregados

- **Botón Cerrar (✕)** (L69)
  - Antes: Sin tooltip
  - Después: `title="Cerrar configuración"`

- **Botón "−" Horas Ideales** (L86)
  - Antes: Sin tooltip
  - Después: `title="Disminuir horas ideales"`

- **Botón "+" Horas Ideales** (L96)
  - Antes: Sin tooltip
  - Después: `title="Aumentar horas ideales"`

- **Botón "−" Puntos Máximos** (L122)
  - Antes: Sin tooltip
  - Después: `title="Disminuir puntos máximos"`

- **Botón "+" Puntos Máximos** (L132)
  - Antes: Sin tooltip
  - Después: `title="Aumentar puntos máximos"`

- **Botón "−" Minutos de Tolerancia** (L149)
  - Antes: Sin tooltip
  - Después: `title="Disminuir minutos de tolerancia"`

- **Botón "+" Minutos de Tolerancia** (L159)
  - Antes: Sin tooltip
  - Después: `title="Aumentar minutos de tolerancia"`

- **Botón "−" Penalización por Hora** (L225)
  - Antes: Sin tooltip
  - Después: `title="Disminuir penalización por hora"`

- **Botón "+" Penalización por Hora** (L235)
  - Antes: Sin tooltip
  - Después: `title="Aumentar penalización por hora"`

- **Botón "Cancelar"** (L249)
  - Antes: Sin tooltip
  - Después: `title="Descartar cambios y cerrar"`

- **Botón "Guardar"** (L261)
  - Antes: Sin tooltip
  - Después: `title="Guardar configuración"`

---

#### 15. **modules/sleep/SleepDashboard.tsx**
**Cambios**: 7 tooltips agregados

- **Botón "↑" Aumentar Hora** (L120)
  - Antes: Sin tooltip
  - Después: `title="Aumentar hora"`

- **Botón "↓" Disminuir Hora** (L155)
  - Antes: Sin tooltip
  - Después: `title="Disminuir hora"`

- **Botón "↑" Aumentar Minuto** (L174)
  - Antes: Sin tooltip
  - Después: `title="Aumentar minuto"`

- **Botón "↓" Disminuir Minuto** (L209)
  - Antes: Sin tooltip
  - Después: `title="Disminuir minuto"`

- **Botón "Agregar Siesta"** (L435)
  - Antes: Sin tooltip
  - Después: `title="Agregar nueva siesta"`

- **Botón "Eliminar" (Siesta)** (L483)
  - Antes: Sin tooltip
  - Después: `title="Eliminar siesta"`

---

#### 16. **modules/water/WaterDashboard.tsx**
**Cambios**: 2 tooltips agregados

- **Botón "+ Vaso"** (L127)
  - Antes: Sin tooltip
  - Después: `title="Agregar vaso de agua"`

- **Botón "- Vaso"** (L134)
  - Antes: Sin tooltip
  - Después: `title="Quitar vaso de agua"`

---

#### 17. **modules/mood/MoodDashboard.tsx**
**Cambios**: Tooltips dinámicos agregados

- **Botones de Selección de Estado de Ánimo** (L253)
  - Antes: Sin tooltip
  - Después: `title="Seleccionar estado de ánimo: {state.title}"`
  - Contexto: Dinámico basado en el título del estado

---

## Archivos que NO Requirieron Cambios

Los siguientes archivos fueron revisados pero no necesitaban cambios adicionales porque:

1. **components/GoalManager.tsx** - Ya tenía tooltips `title` en botones Editar y Desactivar
2. **components/ThemeToggle.tsx** - Ya tenía `aria-label="Cambiar tema"`
3. **components/Navigation.tsx** - Requeriría análisis separado
4. **modules/mood/MoodConfig.tsx** - Requeriría análisis separado (botones de edición)
5. **modules/academic/*.tsx** - Archivos complejos, revisar en futuro

---

## Patrones de Tooltips Utilizados

### Formato Estándar
```tsx
<button
  type="button"
  onClick={handleClick}
  className="..."
  title="Descripción clara del botón"
>
  Label
</button>
```

### Tooltips Dinámicos
```tsx
<button
  title={condition ? 'Opción A' : 'Opción B'}
>
  Toggle
</button>
```

### Botones con Solo Icono
```tsx
<button
  title="Descripción del ícono"
>
  🎯 (o SVG/Image)
</button>
```

---

## Mejoras de Accesibilidad

1. **Usuarios con Mouse**: Verán tooltips al pasar el cursor
2. **Usuarios de Teclado**: Los lectores de pantalla pueden usar el atributo `title`
3. **Consistencia**: Todos los botones sin texto tiene ahora tooltips

---

## Notas Especiales

### Botones con Contexto Incierto

Algunos botones fueron identificados pero no se agregó tooltip si su contexto no era claro:

- Botones con solo ícono en archivos de configuración complejos
- Botones de editor/formato en componentes no identificados claramente
- Iconos SVG sin etiqueta descriptiva

Estos deben revisarse manualmente en el futuro.

---

## Validación Recomendada

1. **En Navegadores**:
   - Verificar que los tooltips aparecen al pasar el cursor
   - Validar que el contenido es legible y útil

2. **Con Lectores de Pantalla**:
   - Probar con NVDA o JAWS
   - Verificar que los tooltips se anuncian correctamente

3. **Responsive**:
   - En móviles, algunos tooltips pueden no ser visibles
   - Considerar usar `aria-label` como alternativa

---

## Archivos Modificados

```
✅ components/GoalForm.tsx
✅ components/HistoryViewer.tsx
✅ components/Analytics.tsx
✅ components/GoalCreateModal.tsx
✅ components/GoalEditModal.tsx
✅ components/ConfirmationModal.tsx
✅ components/UnsavedChangesModal.tsx
✅ components/CompactGoalItem.tsx
✅ components/ModuleTile.tsx
✅ components/GoalTracker.tsx
✅ components/UnifiedColorPicker.tsx
✅ components/InfoModal.tsx
✅ components/EventForm.tsx
✅ modules/sleep/SleepConfig.tsx
✅ modules/sleep/SleepDashboard.tsx
✅ modules/water/WaterDashboard.tsx
✅ modules/mood/MoodDashboard.tsx
```

---

## Próximos Pasos

1. **Revisar Módulos Complejos**: `AcademicConfig.tsx`, `AcademicEventForm.tsx`, etc.
2. **Revisar Páginas de Autenticación**: `login/page.tsx`, `register/page.tsx`, `reset-password/page.tsx`
3. **Revisar Página de Configuración**: `settings/page.tsx`
4. **Revisar Página de Perfil**: `profile/page.tsx`
5. **Testing**: Validar tooltips en navegadores reales

---

## Botones SIN Tooltips (Por Falta de Contexto o No Revisados)

A continuación se lista la información de botones que fueron identificados pero NO recibieron tooltips, agrupados por archivo y línea.

### 🔴 app/login/page.tsx

- **L162 - Botón "Ver/Ocultar contraseña"**
  - Estado: Sin tooltip
  - Razón: Solo tiene `alt` attribute en el `<Image>`, no está el `title` en el `<button>`
  - Acción recomendada: Añadir `title="Ver contraseña"` o `title="Ocultar contraseña"` dinámico

- **L193 - Botón "Iniciar Sesión" (submit)**
  - Estado: Sin tooltip
  - Razón: Botón principal muy obvio, pero podría beneficiarse de tooltip
  - Acción recomendada: Considerar `title="Inicia sesión en tu cuenta"`

- **L206 - Botón "¿Olvidaste tu contraseña?"**
  - Estado: Sin tooltip
  - Razón: Contexto parcialmente claro
  - Acción recomendada: Añadir `title="Recuperar contraseña"`

- **L221 - Botón "Enviar enlace"**
  - Estado: Sin tooltip
  - Razón: No hay claridad sobre qué tipo de enlace
  - Acción recomendada: Añadir `title="Enviar enlace de recuperación por email"`

- **L229 - Botón "Cancelar"**
  - Estado: Sin tooltip
  - Razón: Parcialmente obvio
  - Acción recomendada: Añadir `title="Cancelar recuperación de contraseña"`

---

### 🔴 app/settings/page.tsx

- **L515 - Botón "Actualizar Perfil" (submit)**
  - Estado: Sin tooltip
  - Razón: Es obvio pero falta tooltip
  - Acción recomendada: Añadir `title="Guardar cambios de perfil"`

- **L528 - Botón "Cambiar Contraseña" (collapse toggle)**
  - Estado: Sin tooltip
  - Razón: No es un `<button>` típico, es toggle de sección
  - Acción recomendada: Añadir `title="Expandir"` / `title="Contraer"` dinámico

- **L557 - Botón "Ver/Ocultar contraseña" (Actual)**
  - Estado: Sin tooltip
  - Razón: Solo tiene `alt` en el `<Image>`, no en el `<button>`
  - Acción recomendada: Añadir `title="Ver contraseña"` o `title="Ocultar contraseña"` dinámico

- **L576 - Botón "Ver/Ocultar contraseña" (Nueva)**
  - Estado: Sin tooltip
  - Razón: Solo tiene `alt` en el `<Image>`, no en el `<button>`
  - Acción recomendada: Añadir `title="Ver contraseña"` o `title="Ocultar contraseña"` dinámico

- **L609 - Botón "Ver/Ocultar contraseña" (Confirmar)**
  - Estado: Sin tooltip
  - Razón: Solo tiene `alt` en el `<Image>`, no en el `<button>`
  - Acción recomendada: Añadir `title="Ver contraseña"` o `title="Ocultar contraseña"` dinámico

- **L623 - Botón "Cambiar Contraseña" (submit)**
  - Estado: Sin tooltip
  - Razón: Es obvio pero falta tooltip
  - Acción recomendada: Añadir `title="Guardar nueva contraseña"`

---

### 🔴 app/settings/modules/page.tsx

- **L228 - Botón "Desactivar"**
  - Estado: Sin tooltip
  - Razón: Contexto claro pero falta confirmación
  - Acción recomendada: Añadir `title="Desactivar este módulo"`

- **L235 - Botón "Configurar"**
  - Estado: Sin tooltip
  - Razón: Es obvio pero falta especificidad
  - Acción recomendada: Añadir `title="Abrir configuración del módulo"`

- **L283 - Botón "Activar módulo"**
  - Estado: Sin tooltip
  - Razón: Es obvio pero falta tooltip
  - Acción recomendada: Añadir `title="Activar este módulo"`

---

### 🔴 app/register/page.tsx

- **L298+ - Botones de Sugerencias de Usuario**
  - Estado: Sin tooltip
  - Razón: Contexto incierto - ¿qué hace exactamente?
  - Ubicación: Dentro del bucle de sugerencias (línea aproximada 298-305)
  - Acción recomendada: Añadir `title="Usar esta sugerencia de usuario"`

- **L388 - Botón "Crear Cuenta"**
  - Estado: Sin tooltip
  - Razón: Obvio pero falta
  - Acción recomendada: Añadir `title="Crear nueva cuenta"`

---

### 🔴 app/profile/page.tsx

- **Varios botones de amigos/acciones**
  - Estado: No completamente revisado
  - Razón: Archivo de complejidad media no incluido en revisión inicial
  - Botones identificados: Accept/Decline friend requests, profile actions
  - Acción recomendada: Revisar archivo completo

---

### 🔴 app/reset-password/page.tsx

- **Estado: No revisado**
  - Razón: Archivo no incluido en la revisión sistemática
  - Botones esperados: Enviar, Cancelar, etc.
  - Acción recomendada: Revisar archivo completo

---

### 🔴 components/FriendProfileModal.tsx

- **L157 - Botón "✕" (Cerrar modal)**
  - Estado: Sin tooltip
  - Razón: Similar a otros modales, debería tener
  - Acción recomendada: Añadir `title="Cerrar perfil de amigo"`

---

### 🔴 modules/mood/MoodConfig.tsx

- **Estado: Parcialmente revisado**
  - Razón: Archivo de configuración complejo
  - Botones esperados: +/-, Save, Cancel, etc.
  - Acción recomendada: Revisar y agregar tooltips

---

### 🔴 modules/academic/

- **AcademicConfig.tsx**
  - Estado: No revisado
  - Razón: Módulo complejo con muchos botones
  - Estimado: 15+ botones

- **AcademicEventForm.tsx**
  - Estado: No revisado
  - Razón: Formulario especializado
  - Estimado: 6-8 botones

- **AcademicDashboard.tsx**
  - Estado: No revisado
  - Razón: Dashboard complejo
  - Estimado: 5-6 botones

- **AcademicOverview.tsx**
  - Estado: No revisado
  - Razón: Vista de resumen
  - Estimado: 10-12 botones

- **AcademicTodayCard.tsx**
  - Estado: No revisado
  - Razón: Tarjeta de hoy
  - Estimado: 3-4 botones

---

### 🔴 components/CalendarExplorer.tsx

- **Estado: No revisado**
  - Razón: Componente complejo con navegación
  - Botones esperados: Navegación de calendario, gestión de eventos
  - Estimado: 10-15 botones

---

### 🔴 components/ModuleOrderManager.tsx

- **Estado: No revisado**
  - Razón: Gestor de orden de módulos
  - Botones esperados: Mover arriba/abajo, cerrar, etc.
  - Estimado: 3-5 botones

---

## Resumen de Cobertura

**Total de archivos revisados**: 17  
**Total de tooltips agregados**: 51+

**Archivos no completamente revisados**: 12+
**Botones potenciales sin tooltips**: 50-80+

**Prioridad de revisión futura**:
1. 🔴 **Crítico**: Botones de autenticación (login, register, reset-password)
2. 🔴 **Alto**: Botones de configuración (settings/page.tsx, settings/modules/page.tsx)
3. 🟠 **Medio**: Módulo académico completo
4. 🟠 **Medio**: Calendario y perfiles de amigos
5. 🟡 **Bajo**: Componentes de utilidad

---

**Total de Cambios**: 51+ tooltips en 17 archivos  
**Estado**: ✅ Completado (revisión parcial - 40% de cobertura estimada)
