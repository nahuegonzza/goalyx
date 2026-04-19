Quiero que modifiques el endpoint /api/register para mostrar el error real que está ocurriendo en producción.

Actualmente el endpoint devuelve:

"Error al verificar el usuario"

pero eso oculta completamente el problema real.

---

# 🚨 CAMBIO OBLIGATORIO

Reemplazar el catch actual por:

```ts
catch (error) {
  console.error("REGISTER ERROR FULL:", error);

  return new Response(
    JSON.stringify({
      message: "REGISTER_ERROR",
      error: String(error),
    }),
    { status: 500 }
  );
}
```

---

# 🎯 OBJETIVO

* Ver el error real en logs de Vercel
* Ver el error también en el response del frontend
* Poder identificar exactamente qué falla

---

# ⚠️ IMPORTANTE

No ocultar errores.
No usar mensajes genéricos.
No silenciar exceptions.

---

# 🧪 DESPUÉS DE ESTO

1. Deploy
2. Intentar registrarse
3. Ir a logs de Vercel
4. Buscar:

"REGISTER ERROR FULL"

---

Quiero que esto quede funcionando antes de hacer cualquier otra mejora.
