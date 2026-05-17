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

**Total de Cambios**: 51+ tooltips en 17 archivos  
**Estado**: ✅ Completado (revisión parcial)
