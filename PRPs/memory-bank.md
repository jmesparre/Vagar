# Memory Bank - Vagar Vacaciones

## Sesión: 19 de Noviembre de 2025 (Refactor y Diagnóstico Avanzado)

### Problema: El bypass de autenticación de Vercel sigue fallando silenciosamente.

A pesar de la implementación previa, la página `/admin/experiencias` en Vercel sigue sin cargar datos, y no se generan logs que ayuden a diagnosticar el problema. El entorno local funciona, pero muestra advertencias sobre la ausencia del token de bypass, confirmando que la lógica de `fetch` se está ejecutando.

### Diagnóstico

Se determinó que la implementación original para el bypass de Vercel, aunque lógicamente correcta, estaba mal ubicada (directamente en el componente de la página). Esto dificultaba la depuración y el mantenimiento. La falta de logs en Vercel impedía verificar si las variables de entorno se estaban leyendo correctamente en producción.

### Solución Implementada (Refactor para Diagnóstico)

Para resolver el problema de fondo y facilitar la depuración, se realizaron los siguientes cambios estructurales:

1.  **Centralización de la Lógica de Fetch (`lib/data.ts`):**
    *   Se creó una nueva función `fetchAllExperiences` que encapsula toda la lógica para llamar a la API interna (`/api/experiencias`).
    *   Esta función maneja de forma centralizada la construcción de la URL (`localhost` o Vercel) y la adición del header `Authorization` con el `VERCEL_AUTOMATION_BYPASS_SECRET`.

2.  **Logs de Diagnóstico Avanzados (`lib/data.ts`):**
    *   Se añadieron `console.log` detallados en `fetchAllExperiences` para registrar en Vercel:
        *   La URL completa que se está llamando.
        *   Si el token de bypass fue encontrado y añadido a las cabeceras.
        *   Errores específicos si la respuesta del `fetch` no es `ok`.
    *   Los logs en el entorno local confirmaron que la lógica funciona como se esperaba.

3.  **Refactor de la Página (`app/admin/experiencias/page.tsx`):**
    *   Se eliminó la función local `getExperiences`.
    *   Ahora la página importa y utiliza la nueva función centralizada `fetchAllExperiences` de `lib/data.ts`, simplificando el código del componente.

4.  **Verificación en la API (`app/api/experiencias/route.ts`):**
    *   Se añadió un `console.log` en la ruta GET para confirmar que las solicitudes están llegando al servidor en Vercel.

### Estado Actual y Próximos Pasos

El código ha sido refactorizado y preparado para un diagnóstico efectivo.

1.  **Próximo Paso Crítico:** Hacer `deploy` de estos cambios a Vercel.
2.  **Verificar Logs:** Revisar los logs de Vercel (tanto de la función de la página como de la API route) para obtener la traza completa de la ejecución y finalmente identificar el punto de fallo.

---

## Sesión: 19 de Noviembre de 2025 (Continuación)

### Problema: Error 401 en `/admin/experiencias` en Vercel

Después de solucionar los errores 500, la página `/admin/experiencias` comenzó a mostrar el mensaje "No se pudieron cargar las experiencias". El log de Vercel mostraba un error `401 Authentication Required` al intentar hacer fetch a `/api/experiencias`.

### Diagnóstico

El análisis determinó que el error no provenía de la aplicación, sino de la **Capa de Protección de Despliegue (Deployment Protection)** de Vercel. Esta capa de seguridad estaba bloqueando las llamadas `fetch` que la aplicación se hacía a sí misma desde el servidor (Server Component) a su propia API, ya que estas llamadas no estaban autenticadas contra Vercel.

Se identificó que la solución era utilizar la variable de entorno `VERCEL_AUTOMATION_BYPASS_SECRET` para autorizar estas solicitudes internas. El usuario confirmó que esta variable no estaba configurada en el proyecto de Vercel.

### Solución Implementada

1.  **Modificación del Fetch (`app/admin/experiencias/page.tsx`):**
    *   Se modificó la función `getExperiences` para incluir una cabecera `Authorization` con el valor de `process.env.VERCEL_AUTOMATION_BYPASS_SECRET` en la llamada `fetch`. Esto permite que la solicitud se salte la protección de Vercel de forma segura.

2.  **Instrucciones al Usuario:**
    *   Se indicó al usuario que debía crear la variable de entorno `VERCEL_AUTOMATION_BYPASS_SECRET` en la configuración de su proyecto en Vercel y volver a desplegar.

### Estado Actual

A pesar de haber añadido el código para usar el token de bypass y haber creado la variable de entorno en Vercel, el problema persiste. La página sigue mostrando el error de carga y no aparecen logs en Vercel, lo que sugiere que el fallo ocurre de forma silenciosa.

**Próximos pasos para la siguiente sesión:**
1.  Añadir logs de diagnóstico más detallados en `page.tsx` y `route.ts` para verificar la ejecución y el acceso a las variables de entorno.
2.  Centralizar la lógica de `fetch` en `lib/data.ts` para asegurar consistencia y facilitar el mantenimiento.

---

## Sesión: 19 de Noviembre de 2025

### Problema: Errores 500 en Vercel en las rutas de "Experiencias"

Se reportaron errores `TypeError: j.map is not a function` en las páginas `/admin/experiencias` y `/experiencias/[slug]`, lo que impedía que se mostraran los datos.

### Diagnóstico

El análisis del código reveló que los errores se debían a un manejo inadecuado de fallos en las consultas a la base de datos de Supabase. Cuando una consulta fallaba (posiblemente por problemas de conexión o configuración en Vercel), las funciones en `lib/data.ts` devolvían `undefined` o un array vacío. Las páginas que consumían estos datos no estaban preparadas para manejar una respuesta fallida, e intentaban iterar sobre un valor no iterable, causando el error `.map is not a function`.

### Solución Implementada

Para resolver el problema de raíz y hacer el código más robusto, se realizaron las siguientes modificaciones:

1.  **Manejo de Errores Explícito (`lib/data.ts`):**
    *   Se modificaron las funciones `fetchExperiences`, `fetchExperienceById`, y `fetchExperienceBySlug` para que, en caso de un error en la consulta a Supabase, lancen un error explícito en lugar de retornar un valor que oculte el fallo.

2.  **Mejora en la Configuración de DB (`lib/db.ts`):**
    *   Se mejoraron los mensajes de error para indicar claramente qué variable de entorno de Supabase falta.
    *   Se renombró la variable `supabaseAdmin` a `supabase` para mantener consistencia en el código.

3.  **UI a Prueba de Errores (Páginas de Experiencias):**
    *   Se añadió manejo de errores con `try...catch` en las páginas `/admin/experiencias/page.tsx` y `/experiencias/[slug]/page.tsx`.
    *   Ahora, si la obtención de datos falla, las páginas mostrarán un mensaje de error claro al usuario en lugar de romperse.

4.  **Logging para Depuración (`/api/experiencias/route.ts`):**
    *   Se añadieron `console.log` detallados en la ruta de la API para registrar tanto los datos obtenidos con éxito como los errores, facilitando la depuración futura directamente desde los logs de Vercel.

### Estado Actual
