Estoy teniendo un problema persistente que aún no se resolvió correctamente y necesito que sigas iterando sobre la solución, pero con un enfoque más preciso.

Contexto del bug principal
En settings, al editar el perfil:
Todos los campos se guardan correctamente EXCEPTO firstName y lastName.
El sistema muestra que se guardan, pero al cambiar de pestaña o recargar, los valores desaparecen.
Ya se detectó previamente que el problema estaba en app/api/user/route.ts, específicamente en el GET con lógica de enrichment desde Supabase, que puede sobrescribir datos con null.
Cambios ya aplicados
Se cambió la condición:
De (!dbUser.firstName || !dbUser.lastName)
A (!dbUser.firstName && !dbUser.lastName)
Se evitó guardar null en el update
Se ajustó la respuesta para no devolver enrichedUser inválido
Problema actual

El bug sigue ocurriendo, por lo que:

Puede haber otro punto donde se estén sobrescribiendo los datos
O el problema puede estar en:
El PATCH/PUT endpoint
El frontend (settings/page.tsx)
O una inconsistencia entre lo que se guarda y lo que se vuelve a leer
Además

El build también fallaba y se hicieron múltiples cambios:

Se deshabilitaron warnings de react-hooks/exhaustive-deps
Se tocaron varios useEffect y useMemo
Se hicieron cambios en múltiples componentes (GoalTracker, Analytics, CalendarExplorer, etc.)
Se forzó render dinámico en páginas por problemas con variables de entorno

Esto hace probable que:

Algún cambio haya introducido efectos secundarios
O haya lógica que se ejecuta en cada render y pisa datos
Lo que necesito que hagas ahora
Rastrear el flujo completo de firstName y lastName:
Desde el frontend (formulario en settings)
→ request al backend
→ guardado en Prisma
→ respuesta del API
→ nuevo fetch del GET
Detectar:
Dónde se pierde el valor exactamente
Si se está enviando correctamente en el request
Si Prisma realmente lo persiste
Si el GET lo devuelve mal
Verificar especialmente:
Si hay algún useEffect que vuelve a fetchear y pisa el estado
Si hay múltiples fuentes de verdad (Supabase vs Prisma)
Si el frontend está reseteando el estado con datos viejos
NO des soluciones genéricas ni deshabilites reglas ESLint.
Quiero encontrar la causa raíz real
Si hace falta:
Agregar logs estratégicos (backend y frontend)
Mostrar exactamente qué valores van y vienen
Objetivo

Encontrar por qué firstName y lastName no persisten visualmente, aunque aparentemente se guarden.