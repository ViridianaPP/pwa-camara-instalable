# pwa-camara-instalable

PWA de inspección visual con cámara local, consentimiento previo (pre-permiso) e instalación en la pantalla de inicio.

Desarrollado por Viridiana Portilla Palestina.

## 1. Publicar en GitHub Pages

1. En GitHub, entra al repositorio `pwa-camara-instalable`.
2. Ve a **Settings** → **Pages**.
3. En *Build and deployment*, elige **Source: Deploy from a branch**.
4. Selecciona la rama `main` y la carpeta `/(root)`, y guarda.
5. Espera 1 o 2 minutos y verifica que la URL `https://viridianapp.github.io/pwa-camara-instalable/` cargue por HTTPS.

El repositorio usa rutas relativas (`./`), por lo que funciona correctamente dentro del subdirectorio de GitHub Pages.

## 2. Instalar en Android (Chrome)

1. Abre la URL de GitHub Pages en Chrome.
2. Espera a que cargue el service worker; aparecerá el botón **Instalar app** dentro de la página.
3. Pulsa **Instalar app** y confirma en el diálogo del navegador.
   Si no aparece el botón, usa el menú de Chrome (tres puntos) → **Instalar aplicación** o **Agregar a pantalla de inicio**.
4. Abre la app desde su icono: debe iniciar en modo `standalone`, sin barra de direcciones.

## 3. Instalar en iPhone o iPad (Safari)

1. Abre la URL **en Safari** (Chrome para iOS no puede instalar PWA).
2. La propia página mostrará el aviso: pulsa el botón **Compartir** (cuadrado con flecha hacia arriba).
3. Selecciona **Agregar a pantalla de inicio**, ajusta el nombre si quieres y pulsa **Agregar**.
4. Abre la app desde el icono nuevo: se verá a pantalla completa, sin barra de navegación.

Nota: Safari en iOS no dispara `beforeinstallprompt`, por eso el botón **Instalar app** no aparece y la guía se muestra dentro de la página.

## 4. Probar la cámara con consentimiento consciente

1. Pulsa **Solicitar acceso a cámara**. Primero se muestra el aviso explicativo; aún no se enciende nada.
2. Lee el aviso y pulsa **Aceptar y encender cámara**. Solo entonces aparece el permiso nativo del navegador; elige **Permitir**.
3. Usa **Cambiar cámara** para alternar entre lente trasera (`environment`) y frontal (`user`). El sensor anterior se libera con `track.stop()` antes de abrir el otro.
4. Usa **Apagar cámara** para liberar el hardware. El video se procesa solo en el dispositivo: no se envía ninguna imagen a un servidor.

Si bloqueaste el permiso por accidente: en Android ve al menú del sitio → **Permisos del sitio** → **Cámara** → **Permitir**. En iOS revisa **Ajustes → Safari → Cámara** (o la sección de apps de la pantalla de inicio) y habilita el acceso para esta página.

## 5. Verificación y actualizaciones

- En escritorio: abre DevTools → **Application** → **Manifest** y comprueba que no haya errores de iconos ni advertencias de instalabilidad.
- Los iconos físicos están en `icons/` con dimensiones exactas de 192x192 y 512x512 px.
- Si ya instalaste la app y no ves un cambio reciente, ciérrala por completo y ábrela dos veces (o haz *pull to refresh*). La estrategia del service worker es *Cache First* y el nombre de caché se incrementa en cada cambio publicado.
- Si persiste, borra los datos del sitio y vuelve a agregar la app a la pantalla de inicio.
