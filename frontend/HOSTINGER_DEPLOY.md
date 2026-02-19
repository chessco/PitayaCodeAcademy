# Guía de Despliegue en Hostinger (Frontend)

Esta guía detalla los pasos para desplegar el frontend de PitayaCode Academy en Hostinger.

## 1. Preparación del Build (Ya realizado)

Se ha generado una versión de producción optimizada y empaquetada en un archivo ZIP listo para subir.

- **Archivo generado**: `frontend/hostinger-deploy.zip`
- **Contenido**: Carpeta `dist/` comprimida (HTML, JS, CSS, assets).
- **API URL configurada**: `https://academy-api.pitayacode.io` (según `.env.production`).

## 2. Subida a Hostinger

1.  Inicia sesión en tu panel de **Hostinger** (hpanel).
2.  Ve a **Hosting** -> **Administrar** (en el dominio correspondiente, ej: `app.pitayacode.io` o el que uses para el frontend).
3.  Abre el **Administrador de Archivos** (File Manager).
4.  Navega a la carpeta **public_html**.
    - *Nota*: Si hay archivos existentes (como un `index.php` por defecto), elimínalos o muévelos a un backup.
5.  Sube el archivo `frontend/hostinger-deploy.zip`.
6.  Haz clic derecho sobre el archivo zip subido y selecciona **Extract** (Extraer).
    - Asegúrate de extraerlo directamente en `public_html`.
    - Si se extrae en una subcarpeta (ej: `dist`), mueve todo el contenido al nivel raíz de `public_html`.

## 3. Configuración para React Router (Importante)

Como es una SPA (Single Page Application), necesitamos que todas las rutas sean redirigidas al `index.html` para que React Router funcione al recargar la página.

**Crea un archivo llamado `.htaccess` en `public_html` con el siguiente contenido:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

*Si el archivo ya existe, edítalo y agrega estas reglas.*

## 4. Verificación

1.  Abre tu dominio en el navegador.
2.  Deberías ver la aplicación cargando.
3.  Navega a diferentes secciones y recarga la página para verificar que el `.htaccess` funciona correctamente (no deberías ver errores 404).

## Notas Adicionales

- **Caché**: Si has desplegado anteriormente, es posible que necesites limpiar la caché de tu navegador o de Cloudflare (si lo usas) para ver los cambios inmediatamente.
- **Variables de Entorno**: Las variables como `VITE_API_URL` se "queman" en el código durante el build. Si necesitas cambiarlas, debes modificar `.env.production`, volver a ejecutar el build y subir los archivos nuevamente.
