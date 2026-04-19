Quiero que implementes correctamente un sistema modular real dentro de la aplicación (Next.js + Prisma + PostgreSQL), y luego desarrollar el primer módulo funcional: Módulo de Sueño.

⚠️ IMPORTANTE:
Esto NO es solo agregar una feature.
Quiero una arquitectura escalable que permita agregar módulos fácilmente en el futuro sin hardcodear lógica en el core.

🧠 1. REFACTOR DE ARQUITECTURA (CRÍTICO)
PROBLEMA ACTUAL

Actualmente existen módulos definidos (Finanzas, Gimnasio, etc.) pero:

no están integrados realmente
no hacen nada
probablemente están hardcodeados
no hay sistema dinámico
OBJETIVO

Crear un sistema donde:

los módulos sean configurables
puedan activarse/desactivarse
puedan inyectar lógica al sistema
puedan integrarse con el dashboard, historial y score
IMPLEMENTACIÓN
Modelo en DB (Prisma)

Asegurar modelo tipo:

Module
id
name
key (ej: "sleep", "finance")
isActive
config (JSON)
LÓGICA
El sistema debe cargar módulos activos dinámicamente
Cada módulo puede:
aportar datos diarios
aportar puntos al score
renderizar UI propia
ESTRUCTURA DE CÓDIGO

Crear estructura tipo:

/modules
/sleep
/finance
/gym
...

Cada módulo debe tener:

lógica (cálculo)
configuración
componentes UI
integración con core
🔌 2. INTEGRACIÓN CON EL CORE

Los módulos deben poder:

aparecer en el dashboard
aparecer en historial
afectar el score diario

⚠️ SIN modificar manualmente cada parte del core.

Usar un sistema tipo:

registro de módulos activos
iteración dinámica
🌙 3. MÓDULO DE SUEÑO (IMPLEMENTACIÓN COMPLETA)
ACTIVACIÓN
todos los módulos están desactivados por defecto
si el módulo "sleep" está activo:
aparece automáticamente en dashboard
aparece en historial
aporta al score
COMPORTAMIENTO

El módulo de sueño NO es un objetivo editable:

es fijo
no se puede borrar
no se puede renombrar
UI (DASHBOARD)

Agregar una fila tipo objetivo:

Nombre: "Sueño"

Inputs:

hora de acostarse
hora de despertarse

Ejemplo:

[ 🌙 Sueño ] [ 23:30 ] → [ 07:30 ]

CÁLCULO DE HORAS
calcular diferencia entre ambas horas
contemplar cruce de medianoche

Ejemplo:

23:00 → 07:00 = 8 horas

SISTEMA DE PUNTOS (VERSIÓN INICIAL)
horas ideales: 8
puntos máximos: 2
LÓGICA:
si horas == ideal → +2 puntos
por cada hora de diferencia:
resta 1 punto

Ejemplo:

8h → +2
7h → +1
9h → +1
6h → 0
10h → 0
⚙️ 4. CONFIGURACIÓN DEL MÓDULO SUEÑO

Agregar botón de configuración dentro del módulo

OPCIONES:
1. Horas ideales
default: 8
2. Puntos máximos
default: 2
3. Modo de penalización
Opción A (automática):
cada hora de diferencia resta:
(puntos máximos / 2)
Opción B (manual):
el usuario define:
cuánto resta por hora de diferencia
GUARDAR CONFIGURACIÓN
persistir en Module.config (JSON)
cargar dinámicamente
📊 5. INTEGRACIÓN CON SCORE

El módulo debe:

generar su propio resultado diario
sumarse al score total
IMPORTANTE:

No mezclar con GoalEntry directamente.

Debe ser independiente pero compatible.

📅 6. INTEGRACIÓN CON HISTORIAL

En historial:

mostrar datos de sueño del día
permitir ver horas registradas
reflejar impacto en score
⚡ 7. UX
inputs tipo time picker
interacción simple
consistente con objetivos
🧱 8. ESCALABILIDAD

Preparar para que otros módulos puedan:

tener inputs propios
tener lógica propia
tener config propia
integrarse igual que sueño
📦 OUTPUT ESPERADO
Refactor completo del sistema de módulos
Sistema dinámico (no hardcodeado)
Módulo de sueño funcional
UI integrada en dashboard e historial
Cálculo de puntos correcto
Configuración editable del módulo
Persistencia en DB
Código limpio, modular y escalable
⚠️ REGLAS
no hardcodear módulos en el core
no romper sistema de objetivos existente
mantener tipado fuerte
mantener separación clara

Si es necesario reorganizar arquitectura, hacerlo.

Prefiero una solución sólida que permita crecer fácilmente.