# Menu QR - BarBaros Burguer

SPA mobile-first (HTML + CSS + JS vanilla) con panel de administracion y editor de imagenes nativo.

## Arrancar

```bash
npm install
npm start
```

Servidor en `http://localhost:3000`. El menu publico carga datos via `/api/menu`.

## Estructura

```text
Menu/
  index.html              -- Menu publico (PWA)
  admin.html              -- Panel de administracion (servido desde src/admin/)
  manifest.webmanifest    -- PWA manifest
  sw.js                   -- Service Worker
  server/
    server.js             -- Express + Sharp (API, sesiones, upload)
    data/
      menu.json           -- Datos del menu (runtime, se edita desde el admin)
    seed-menu.json        -- Datos iniciales si menu.json no existe
  src/
    admin/
      admin.html          -- Panel admin
      admin.js            -- Logica del admin + editor de imagenes nativo
    css/
      propuesta-v4.css    -- Estilos del menu publico
    js/
      propuesta-v4.js     -- Logica del menu publico (carrito, wizard, PWA)
  assets/
    brand/                -- Logos e imagenes de marca
    icons/                -- Iconos PWA
    products/             -- Imagenes de productos (subidas desde el admin)
```

## Admin

Abrir `http://localhost:3000/admin.html`. Usuario por defecto: `admin` / `admin123`.

El admin permite:
- Editar datos del negocio (nombre, WhatsApp)
- CRUD de productos (nombre, categoria, precio, variantes, tipo de accion)
- Editor de imagenes nativo con Canvas (recorte 16:9, fondos, zoom, drag)
- Gestion de extras (proteínas, toppings, salsas)

## Como agregar productos

1. Abrir el panel admin
2. Click en "+ Nuevo"
3. Completar nombre, categoria, descripcion, tipo
4. Subir imagen (se abre el editor de recorte 16:9)
5. Ajustar y confirmar
6. Click en "Guardar"

## Publicacion para QR

1. Subir el proyecto a un hosting que soporte Node.js (Railway, Render, etc.)
2. Configurar `PORT` y `SESSION_SECRET` como variables de entorno
3. Usar la URL publica para generar el QR
