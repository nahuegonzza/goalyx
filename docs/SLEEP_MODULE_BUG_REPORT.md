# 🐛 Bug Report: Sleep Module - Data Storage & Display Issue

**Fecha de creación:** 27 de abril de 2026  
**Estado:** Por investigar  
**Prioridad:** Media

---

## 📋 Resumen del problema

El módulo de sueño no está funcionando correctamente al cargar datos en el calendario. El problema es que **los datos de sueño no se están mostrando en el calendario cuando se navega a días anteriores**, aunque teóricamente deberían estar almacenados en la base de datos.

### Escenario de prueba:
1. **Ayer (26 de abril):** Duermes de 08:00 a 16:00 (8 horas)
2. **Hoy (27 de abril):** Duermes de 09:00 a 15:00 (6 horas)
3. **Resultado esperado:** 
   - Cada día debería mostrar sus datos en el calendario
   - El 26 debería sumar 8 horas a su puntuación
   - El 27 debería sumar 6 horas a su puntuación
4. **Resultado actual:** ❌ Los datos desaparecen cuando navegas a otros días

---

## 🔍 Investigación técnica

### Componentes involucrados:

1. **[modules/sleep/SleepDashboard.tsx](../../modules/sleep/SleepDashboard.tsx)**
   - Se carga con `const today = getLocalDateString()` de forma hardcodeada
   - Siempre intenta cargar datos de **hoy**, no del día seleccionado
   - El prop `date` nunca se utiliza

   ```typescript
   // PROBLEMA: Ignora el prop 'date' que le envía CalendarExplorer
   const today = getLocalDateString();
   
   useEffect(() => {
     async function loadTodayEntry() {
       const res = await fetch(`/api/moduleEntries?date=${today}&module=sleep`);
       // ...siempre carga 'today', no el día seleccionado
     }
   }, [today]);
   ```

2. **[components/CalendarExplorer.tsx](../../components/CalendarExplorer.tsx) (línea ~575)**
   - Renderiza el SleepDashboard pasando `date={selectedDate}`
   - Pero SleepDashboard nunca lo recibe correctamente

   ```typescript
   <Component
     key={module.slug}
     config={module.config}
     module={module}
     isEditing={isEditingDay}
     date={selectedDate}  // ✅ Se envía
   />
   ```

3. **[modules/sleep/module.ts](../../modules/sleep/module.ts)**
   - En `calculateScore()`, siempre busca entradas de hoy
   - No recibe la fecha del día seleccionado

   ```typescript
   const today = new Date().toISOString().slice(0, 10);
   const todayEntry = entries.find(e => {
     // Siempre busca HOY, no el día actual del calendario
     return entryDate === today;
   });
   ```

4. **[app/api/moduleEntries/route.ts](../../app/api/moduleEntries/route.ts)**
   - El endpoint parece estar bien implementado
   - Soporta parámetro `?date=` para filtrar por día específico
   - La data se guarda correctamente con `upsert()`

---

## ❓ Hipótesis del problema

Existen dos posibilidades (o ambas):

### Hipótesis 1: **Problema de almacenamiento**
- Los datos NO se guardan en la BD cuando seleccionas una fecha diferente de hoy
- En el SleepDashboard, la función `saveEntry()` siempre usa `today` como fecha
- **Verificar:** Revisar la BD directamente en Prisma Studio

### Hipótesis 2: **Problema de visualización**
- Los datos SÍ se guardan, pero no se cargan/muestran en el calendario
- El SleepDashboard no tiene forma de acceder a datos de días anteriores
- El componente siempre intenta cargar `date=today` sin importar qué día está seleccionado
- **Verificar:** Hacer queries directas al API: `/api/moduleEntries?date=2026-04-26&module=sleep`

---

## 🔧 Puntos críticos a investigar

1. **¿Se están guardando los datos en la BD?**
   - Usa [Prisma Studio](../../docs/SETUP_COMPLETE.md) para verificar la tabla `ModuleEntry`
   - Busca registros con `module.slug='sleep'` para días anteriores
   - Verifica que el campo `date` tenga el día correcto (sin timestamp)

2. **¿Se pueden recuperar via API?**
   ```bash
   # Test manual del endpoint:
   GET /api/moduleEntries?date=2026-04-26&module=sleep
   GET /api/moduleEntries?date=2026-04-27&module=sleep
   ```

3. **¿El SleepDashboard recibe la fecha correcta?**
   - Agregar `console.log(props)` en SleepDashboard para verificar si recibe `date` prop
   - Verificar si se renderiza 1 o múltiples veces

4. **¿El calculateScore se ejecuta correctamente?**
   - Verificar que las entradas del módulo se estén contando en `scoresByDay` del calendario

---

## 📝 Soluciones propuestas

### Solución corta (parche):
1. Modifica SleepDashboard para aceptar y usar el prop `date`
2. Reemplaza `getLocalDateString()` con el prop recibido
3. Modifica `saveEntry()` para guardar con la fecha correcta

### Solución larga (arquitectura):
1. Implementar un patrón consistente en todos los módulos para manejar fechas seleccionadas
2. Crear un hook custom `useModuleDate()` que centralice la lógica de cargar datos por fecha
3. Implementar tests para verificar que los módulos funcionen en cualquier día del calendario

---

## 🧪 Pasos de test para reproducir

1. Abre la aplicación y ve a la sección de Sueño
2. Registra sueño para hoy (ej: 08:00 → 16:00)
3. Ve al calendario (vista semanal)
4. Verifica que hoy muestre los puntos del sueño ✓
5. **Navega a ayer o hace una semana**
6. Intenta registrar sueño para ese día
7. ❌ **Verifica si se guardó y se mostró en el calendario**
8. Recarga la página y ve si el dato persiste

---

## 📌 Notas adicionales

- El módulo de sueño es el único completamente desarrollado (según comentarios del código)
- Los mismos problemas probablemente afecten a otros módulos (gym, agua, hábitos financieros, etc.)
- Es importante resolver esto ANTES de escalar otros módulos
- La BD usa Prisma con PostgreSQL
- El calendario tiene modo: semanal, mensual, anual

---

## 🔗 Archivos relacionados

- [SleepDashboard.tsx](../../modules/sleep/SleepDashboard.tsx)
- [modules/sleep/module.ts](../../modules/sleep/module.ts)
- [CalendarExplorer.tsx](../../components/CalendarExplorer.tsx)
- [API: moduleEntries](../../app/api/moduleEntries/route.ts)
- [Prisma Schema](../../prisma/schema.prisma) - modelo `ModuleEntry`

---

## 📞 Contexto de desarrollo

**Stack:**
- Next.js 14+
- React 18+
- TypeScript
- Prisma ORM + PostgreSQL
- Supabase Auth

**Módulos activos:**
- Sleep (Sueño) - ACTIVO ⏰
- Gym (Gimnasia) - Planificado
- Water (Agua) - Planificado
- Finance (Finanzas) - Planificado
- Habits (Hábitos) - Planificado

