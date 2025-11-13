# 📝 Plan de Despliegue de Base de Datos en WNPower

## 🎯 Objetivo
Desplegar la base de datos MySQL del proyecto Vagar en WNPower, asegurando la integridad del sitio WordPress existente y conectando la nueva aplicación Next.js a la base de datos en la nube.

---

## ⚠️ Prerrequisitos y Precauciones
- **Acceso a WNPower:** Credenciales de acceso al panel de hosting.
- **No interrumpir el servicio:** El sitio de WordPress debe permanecer online durante todo el proceso.
- **Backup:** Es crucial tener un respaldo completo de la base de datos actual antes de hacer cualquier cambio.

---

## 🚀 Fases del Plan

### Fase 1: Respaldo de Seguridad (Backup)
*   **Paso 1.1:** Acceder al panel de WNPower y localizar la gestión de bases de datos (phpMyAdmin o similar).
*   **Paso 1.2:** Identificar la base de datos existente de WordPress.
*   **Paso 1.3:** Realizar una exportación completa (backup) de la base de datos de WordPress y guardarla en un lugar seguro.

### Fase 2: Creación de la Nueva Base de Datos
*   **Paso 2.1:** Crear una nueva base de datos en WNPower para el proyecto Vagar.
*   **Paso 2.2:** Crear un nuevo usuario de base de datos con contraseña segura.
*   **Paso 2.3:** Asignar todos los privilegios al nuevo usuario sobre la nueva base de datos.
*   **Paso 2.4:** Anotar las credenciales: host, nombre de la base de datos, usuario y contraseña.

### Fase 3: Migración de Datos
*   **Paso 3.1:** Importar el schema de la base de datos (`init.sql`) a la nueva base de datos en WNPower.
*   **Paso 3.2:** (Opcional) Si hay datos locales que migrar, exportarlos y luego importarlos a la nueva base de datos.

### Fase 4: Conexión de la Aplicación
*   **Paso 4.1:** Actualizar el archivo de variables de entorno (`.env.local` o similar) del proyecto Next.js con las nuevas credenciales de la base de datos.
*   **Paso 4.2:** Asegurarse de que el host de la base de datos permite conexiones remotas si la aplicación no está en el mismo servidor.

### Fase 5: Verificación y Pruebas
*   **Paso 5.1:** Desplegar la aplicación Next.js.
*   **Paso 5.2:** Realizar pruebas para confirmar que la aplicación lee y escribe correctamente en la nueva base de datos.
*   **Paso 5.3:** Verificar que el sitio de WordPress sigue funcionando correctamente.

---

## 🗒️ Resumen de Sesión (13/11/2025)

### ✅ Progreso Realizado:
- **Fase 1 (Completada):** Se realizó con éxito el backup de la base de datos de WordPress (`vagarcom_wp850`).
- **Fase 2 (Completada):** Se creó la nueva base de datos (`vagarcom_vagar`) y el usuario (`vagarcom_vagar_user`) en el cPanel de WNPower.
- **Fase 3 (Completada):** Se importó la estructura inicial de la base de datos desde el archivo `init.sql`.
- **Fase 4 (En progreso):** Se identificaron las credenciales necesarias y se determinó que el `DB_HOST` es la IP `190.228.29.101`.

### ➡️ Próximos Pasos:
1.  **Autorizar Conexión Remota:** En el cPanel de WNPower, ir a "MySQL Remoto" y añadir un nuevo "Host de Acceso" con el valor `%` para permitir conexiones desde Vercel.
2.  **Configurar Variables en Vercel:** Añadir las variables de entorno (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) en la configuración del proyecto en Vercel.
3.  **Continuar con la Fase 5:** Realizar el despliegue y las pruebas de conexión.

---

## 🗒️ Resumen de Sesión (13/11/2025 - Tarde)

### ✅ Progreso Realizado:
- **Configuración de Auth:** Se aclaró el uso de las variables `NEXTAUTH_URL` y `NEXTAUTH_SECRET` y se subieron a Vercel.
- **Diagnóstico de Conexión:** Al intentar conectar la aplicación local a la base de datos remota, se encontró el error `ECONNREFUSED 190.228.29.101:3306`.
- **Troubleshooting de Acceso Remoto:**
    - Se verificó que el host `%` estaba correctamente añadido en "MySQL Remoto" en cPanel.
    - Como prueba adicional, se añadió la IP específica del usuario (`45.178.1.252`) a los hosts permitidos.
    - El error de conexión persistió en ambos casos, lo que sugiere un bloqueo a nivel de firewall del servidor.

### ➡️ Próximos Pasos:
1.  **Contactar a Soporte de WNPower:** El paso más importante es crear un ticket de soporte solicitando que verifiquen y, si es necesario, abran el puerto `3306` para conexiones remotas en el firewall del servidor. Esta es la causa más probable del problema.
2.  **Re-testear Conexión:** Una vez que WNPower confirme que el puerto está abierto, volver a probar la conexión desde el entorno de desarrollo local.
3.  **Verificar Despliegue en Vercel:** Si la conexión local funciona, el despliegue en Vercel también debería conectarse correctamente.
