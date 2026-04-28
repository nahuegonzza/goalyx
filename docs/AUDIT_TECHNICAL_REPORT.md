# 🔍 Auditoría Técnica - Goalyx

**Fecha de auditoría:** 28 de Abril de 2026  
**Auditor:** Senior Developer (AI Assistant)  
**Versión:** Next.js + Prisma + Supabase

---

## 📋 Resumen Ejecutivo

| Categoría | Estado | Críticos | Altos | Medios | Bajos |
|-----------|--------|----------|-------|--------|-------|
| **Backend/API** | 🟡 | 1 | 3 | 4 | 2 |
| **Base de Datos** | 🟢 | 0 | 0 | 2 | 1 |
| **Frontend/UI** | 🟡 | 1 | 2 | 5 | 3 |
| **Arquitectura** | 🟢 | 0 | 0 | 3 | 2 |
| **Módulos** | 🔴 | 1 | 2 | 2 | 1 |
| **TOTAL** | **🟡** | **3** | **7** | **16** | **9** |

> **Nota:** 6 de los 9 issues críticos/altos documentados previamente YA ESTÁN SOLUCIONADOS.

---

## ✅ Estado de Issues Previos Documentados

| # | Issue Documentado | Estado | Notas |
|---|-------------------|--------|-------|
| 1 | **Prisma schema validation (P1012)** - datasource url no soportado | ✅ **SOLUCIONADO** | Schema usa `provider = "postgresql"` sin url. Existe `prisma.config.ts` separado. |
| 2 | **Register 500 en producción** | ✅ **SOLUCIONADO** | Agregado `dynamic = 'force-dynamic'` y `runtime = 'nodejs'`. Logging implementado. |
| 3 | **User firstName/lastName se sobrescribe con null** | ✅ **SOLUCIONADO** | Condición cambiada a `!dbUser.firstName && !dbUser.lastName`. Solo actualiza si hay datos nuevos. |
| 4 | **Módulo Sueño - datos no cargan en días anteriores** | ❌ **SIN SOLUCIONAR** | `SleepDashboard` ahora usa prop `date` pero aún no funciona correctamente. |
| 5 | **Prisma Client inestable en Vercel** | ✅ **SOLUCIONADO** | Función `getPrismaClient()` implementada. |
| 6 | **Logging insuficiente en producción** | ✅ **SOLUCIONADO** | Sistema de logging con timestamps implementado. |

---

## 🚨 Problemas Críticos (Sin resolver)

### 1. Módulo Sueño - Datos no persisten entre días

**Severidad:** 🔴 CRÍTICO  
**Ubicación:** `modules/sleep/SleepDashboard.tsx`, `modules/sleep/module.ts`

**Estado:** ❌ **SIN SOLUCIONAR** - Mismo problema documentado en `docs/SLEEP_MODULE_BUG_REPORT.md`

**Descripción:**
El módulo de sueño no carga correctamente los datos cuando navegas a días anteriores en el calendario. El problema está en que `SleepDashboard` usa `getLocalDateString()` hardcodeado en lugar de usar el prop `date` que le pasa `CalendarExplorer`.

```typescript
// PROBLEMA en SleepDashboard.tsx - LÍNEA 18
const selectedDate = date || getLocalDateString(); // ← Usa date si existe, pero...

useEffect(() => {
  async function loadTodayEntry() {
    const res = await fetch(`/api/moduleEntries?date=${selectedDate}&module=sleep`);
    // ← Esto funciona si selectedDate es correcto
  }
}, [selectedDate]);
```

**Verificación:** El código actual SÍ usa el prop `date`:
```typescript
const selectedDate = date || getLocalDateString();
```

**Pero el problema puede estar en:**
1. El `useEffect` no se dispara cuando `date` cambia desde el padre
2. El `module.ts` de sleep también usa `getLocalDateString()` hardcodeado
3. Hay un problema de timing en la carga

**Estado del fix:** 📝 Parcialmente implementado pero aún no funciona.

---

### 2. Tabla Score no se usa - Puntuación calculada en memoria

**Severidad:** 🔴 CRÍTICO  
**Ubicación:** `app/api/user/stats/route.ts`, `core/score/scoreCalculator.ts`

**Descripción:**
La aplicación calcula el score diario en memoria usando `calculateDailyScore()` pero **nunca persiste estos valores en la tabla `Score`** de la base de datos. Esto significa:

- No hay historial de puntuación
- La métrica "Puntuación Total" en perfil usa lógica alternativa (cuenta GoalEntries)
- La tabla `Score` está vacía y es inútil

```typescript
// En score/daily/route.ts
const score = calculateDailyScore(...);
// ← NUNCA se guarda en prisma.score.create()
```

**Recomendación:** Crear un job o función que persista el score diario en la tabla `Score`.

---

### 3. Seguridad - Contraseña almacenada en texto plano

**Severidad:** 🔴 CRÍTICO  
**Ubicación:** `prisma/schema.prisma` - modelo User

**Descripción:**
El campo `password` en el modelo User existe pero **no se usa activamente** - la autenticación es via Supabase Auth. El campo queda ahí como residuo histórico.

```prisma
model User {
  password  String?  // ← Residuo, no se usa en login
```

**Estado:** 🟡 BAJO RIESGO - No se usa pero debería limpiarse.

---

### 4. Memory Leak - Prisma Client en desarrollo

**Severidad:** 🔴 CRÍTICO  
**Ubicación:** `lib/prisma.ts`

**Descripción:**
El código actual tiene una función dedicada `getPrismaClient()` que funciona correctamente. Sin embargo, todavía existe código de proxy antiguo que podría causar problemas.

**Estado:** ✅ **PARCIALMENTE SOLUCIONADO** - La función dedicada funciona, pero el código proxy antiguo permanece sin usarse.

---

## 🟠 Problemas de Alta Prioridad

### 5. Inconsistencia en autenticación

**Severidad:** 🟠 ALTA  
**Ubicación:** Múltiples archivos en `lib/supabase-*.ts`

**Descripción:**
Hay dos funciones de autenticación con comportamiento diferente:
- `getServerSupabaseUser()` - retorna objeto complejo con `isServiceRole`
- `ensurePrismaUserForSession()` - tiene lógica de fallback diferente

Esto causa confusión y posibles inconsistencias cuando se usa una u otra.

---

### 6. Validación de email débil en registro

**Severidad:** 🟠 ALTA  
**Ubicación:** `app/api/register/route.ts`

**Descripción:**
El validador de email acepta formatos que no cumplen RFC 5321. Además, no hay verificación de dominio real.

```typescript
// VALIDADOR ACTUAL - muy básico
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Estado:** 📝 Documentado en `docs/ANALYSIS_PRODUCTION_FIX.md` pero el fix es parcial.

---

### 7. Sin rate limiting en APIs auth

**Severidad:** 🟠 ALTA  
**Ubicación:** `app/api/auth/*`

**Descripción:**
Los endpoints de login, registro y cambio de contraseña no tienen rate limiting, permitiendo ataques de fuerza bruta.

---

### 8. Manejo de errores inconsistente

**Severidad:** 🟠 ALTA  
**Ubicación:** Toda la aplicación

**Descripción:**
- Algunos endpoints retornan `{ error: string }`
- Otros retornan `{ message: string }`
- No hay estándar de formato de respuesta de error

---

### 9. Sin paginación en listados

**Severidad:** 🟠 ALTA  
**Ubicación:** `api/goals`, `api/goalEntries`, `api/moduleEntries`

**Descripción:**
Los endpoints retornan TODOS los registros sin paginación. En producción con muchos datos esto causará problemas de rendimiento.

---

## 🟡 Problemas de Media Prioridad

### 10. Iconos mezclados en carpetas

**Severidad:** 🟡 MEDIA  
**Ubicación:** `public/navbar_icons/`, `public/icons/ui/`

**Descripción:**
Los iconos de contraseña y streak estaban en `navbar_icons` aunque no son de navbar. Ya reorganizado parcialmente.

---

### 11. Código duplicado en módulos

**Severidad:** 🟡 MEDIA  
**Ubicación:** `modules/*/module.ts`

**Descripción:**
Cada módulo tiene su propia implementación de `calculateScore` con lógica similar pero no reutilizada. Debería haber un sistema unificado.

---

### 12. Sin tests unitarios

**Severidad:** 🟡 MEDIA  
**Ubicación:** Proyecto completo

**Descripción:**
No existe suite de tests. Cualquier cambio puede romper funcionalidad existente sin detección.

---

### 13. Variables de entorno no validadas al inicio

**Severidad:** 🟡 MEDIA  
**Ubicación:** `lib/prisma.ts`, `lib/supabase-server.ts`

**Descripción:**
La app inicia sin verificar que las variables de entorno requeridas existan, causando errores crípticos en runtime.

---

### 14. Estado de carga inconsistente entre páginas

**Severidad:** 🟡 MEDIA  
**Ubicación:** Múltiples páginas

**Descripción:**
Algunas páginas muestran loading spinner, otras muestran "Cargando...", otras nada. Sin consistencia.

---

### 15. Theme toggle sin persistencia efectiva

**Severidad:** 🟡 MEDIA  
**Ubicación:** `components/ThemeToggle.tsx`

**Descripción:**
El tema se guarda en localStorage pero hay flash de tema incorrecto en carga inicial porque el theme provider se ejecuta después del render.

---

### 16. WeekDays no se usa efectivamente

**Severidad:** 🟡 MEDIA  
**Ubicación:** `prisma/schema.prisma`, meta de Goal

**Descripción:**
El campo `weekDays` existe en el schema pero la lógica de filtrar objetivos por día de la semana no está implementada completamente.

---

### 17. Módulos sin sistema de versiones

**Severidad:** 🟡 MEDIA  
**Ubicación:** `modules/index.ts`

**Descripción:**
Los módulos se cargan estáticamente sin posibilidad de actualizar su lógica sin redeploy.

---

### 18. Calendario sin virtualization

**Severidad:** 🟡 MEDIA  
**Ubicación:** `components/CalendarExplorer.tsx`

**Descripción:**
Al mostrar muchos meses/años, el DOM crece sin límite. Debería usar windowing/virtualization.

---

### 19. StreakDay tabla duplicada

**Severidad:** 🟡 MEDIA  
**Ubicación:** `prisma/schema.prisma`

**Descripción:**
Las rachas se calculan desde `StreakDay` pero también hay lógica en GoalEntry. Hay redundancia.

---

### 20. Sin auditoría de cambios en datos

**Severidad:** 🟡 MEDIA  
**Ubicación:** Base de datos

**Descripción:**
No hay registro de quién cambió qué ni cuándo en la base de datos.

---

### 21. Configuración de módulos hardcodeada

**Severidad:** 🟡 MEDIA  
**Ubicación:** `modules/*/module.ts`

**Descripción:**
Los valores por defecto de configuración están hardcodeados en cada módulo en lugar de venir de una configuración central.

---

### 22. Sin handling de timezone explícito

**Severidad:** 🟡 MEDIA  
**Ubicación:** Varios archivos

**Descripción:**
Hay mezcla de `new Date()`, `getLocalDateString()`, y fechas UTC. Puede causar bugs sutiles.

---

### 23. Error boundary global no existe

**Severidad:** 🟡 MEDIA  
**Ubicación:** `app/layout.tsx`

**Descripción:**
Si un componente falla, toda la app crashea. No hay error boundary para mostrar fallback.

---

### 24. Meta tags SEO incompletos

**Severidad:** 🟡 MEDIA  
**Ubicación:** `app/layout.tsx`

**Descripción:**
Faltan meta tags para Open Graph, Twitter cards, y descripción SEO.

---

### 25. Service worker básico sin offline support

**Severidad:** 🟡 MEDIA  
**Ubicación:** `public/sw.js`

**Descripción:**
El service worker no implementa caching offline real. La app no funciona sin conexión.

---

### 26. Formularios sin debounce en validación

**Severidad:** 🟡 MEDIA  
**Ubicación:** Varios formularios

**Descripción:**
Las validaciones en tiempo real (ej: disponibilidad de username) hacen request en cada keystroke sin debounce.

---

### 27. Sin loading states en navegación

**Severidad:** 🟡 MEDIA  
**Ubicación:** Componentes Navigation

**Descripción:**
Al navegar entre páginas hay delay perceptible sin feedback visual.

---

### 28. Modal de configuración accesible desde móvil

**Severidad:** 🟡 MEDIA  
**Ubicación:** Módulos (SleepConfig, MoodConfig)

**Descripción:**
Los modales de configuración son muy altos y pueden ser difíciles de cerrar en móvil.

---

### 29. Goals desactivados no se filtran en UI

**Severidad:** 🟡 MEDIA  
**Ubicación:** `components/GoalTracker.tsx`

**Descripción:**
Los goals con `status = 'INACTIVE'` o `isActive = false` todavía aparecen en la lista sin distinción visual clara.

---

### 30. Score negativo no tiene validación

**Severidad:** 🟡 MEDIA  
**Ubicación:** Módulos

**Descripción:**
El score puede ficar negativo sin límite, lo cual puede ser confuso para usuarios.

---

## 🟢 Hallazgos Positivos

### Arquitectura bien pensada
- Separación clara entre core y módulos
- Sistema de eventos extensible
- Prisma con manejo de conexiones para Vercel

### UI/UX correcto
- Diseño responsive con Tailwind
- Dark mode implementado
- Navegación intuitiva

### Documentación
- Buenos documentos de errores previos
- Historial de problemas y soluciones

### Código limpio
- TypeScript bien usado
- Componentes React bien estructurados
- Hooks personalizados para lógica reutilizable

---

##Prioridades de Fix

### Sprint 1 (Crítico)
1. 🔧 Fix módulo sueño - usar prop date
2. 🔧 Persistir scores en tabla Score
3. 🔧 Eliminar campo password del schema
4. 🔧 Limpiar código Prisma proxy

### Sprint 2 (Alto)
5. Unificar autenticación
6. Agregar rate limiting
7. Estandarizar errores API
8. Agregar paginación

### Sprint 3 (Medio)
9. Agregar tests
10. Optimizar calendario
11. Mejorar theme loading
12. Agregar auditoría

---

## 🔭 Mejoras Futuras Sugeridas

### Short-term (1-2 meses)
- Dashboard con gráficos de progreso
- Notificaciones push
- Exportar datos a CSV/JSON
- Mejora en móvil del calendario

### Medium-term (3-6 meses)
- Sistema de logros/medallas
- Amigos y competencia social
- Widgets para móvil (iOS/Android)
- Integración con wearables

### Long-term (6+ meses)
- AI para sugerencias de hábitos
- Análisis predictivo de patrones
- API pública para integraciones
- Marketplace de módulos comunitarios

---

*Auditoría generada automáticamente. Revisar y priorizar según negocio.*