# El Mercado de Amazonas · Tu mercado, a tu puerta

Tienda web de un puesto de mercado: catálogo con precios del día, canasta, pedido por WhatsApp y panel de administración.
Los datos (productos, precios, configuración, apariencia y pedidos) viven en **Firebase (Firestore)** y se actualizan en tiempo real.
No hay contenido en HTML estático: toda la interfaz se construye desde JavaScript. Sitio publicado: https://elmercadodeas.web.app

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `index.html` | La tienda. Solo metadatos (Open Graph, manifest, íconos, fuentes); la interfaz se construye desde JS. |
| `admin.html` | El panel de administración. |
| `css/styles.css` | Estilos. Tema claro (fondo blanco) y oscuro (fondo negro). Colores y letras se cambian desde el panel. |
| `js/firebase-config.js` | **Aquí pegas los datos de tu proyecto de Firebase.** |
| `js/db.js` | Capa de datos: Firestore en tiempo real y Firebase Auth. |
| `js/app.js` | Lógica de la tienda: catálogo, búsqueda, canasta, yapa, pedido, tema e idioma. |
| `js/admin.js` | Lógica del panel: pedidos, productos, categorías, unidades, tienda, apariencia y datos. |
| `js/i18n.js` | Todos los textos en español e inglés. |
| `js/store.js` | Preferencias del navegador (tema, idioma, canasta) y utilidades. |
| `js/data.js` | Catálogo de ejemplo para arrancar un proyecto vacío. |
| `firestore.rules` | Reglas de seguridad de Firestore. |
| `storage.rules` | Reglas de Storage para las imágenes de producto. |
| `sw.js`, `manifest.json` | App instalable (PWA): caché del shell y modo standalone. |
| `404.html` | Página de error con el mismo estilo. |
| `img/` | Ícono de la app, `apple-touch-icon` e imagen para compartir (`og.png`). |
| `scripts/seed.mjs` | Carga el catálogo de ejemplo desde Cloud Shell. |
| `firebase.json` | Configuración de Firebase Hosting. |

## Puesta en marcha (una sola vez)

1. **Crea el proyecto** en [console.firebase.google.com](https://console.firebase.google.com) → *Agregar proyecto*.
2. **Firestore**: menú *Compilación → Firestore Database → Crear base de datos* (modo producción, la región más cercana).
3. **Authentication**: *Compilación → Authentication → Comenzar → Correo electrónico/contraseña → Habilitar*.
   Luego en la pestaña *Users → Agregar usuario* crea tu usuario administrador (correo y contraseña). Con ese usuario entras al panel.
4. **Datos de la app**: ya están en `js/firebase-config.js` (proyecto `elmercadodeas`). Si algún día cambias de proyecto, copia el nuevo `firebaseConfig` desde *Configuración del proyecto → Tus apps → Web* y reemplázalo ahí.
5. **Reglas**: en *Firestore Database → Reglas* pega el contenido de `firestore.rules` y publica.
   (O usa la CLI: `firebase deploy --only firestore:rules`).
6. **Dominios autorizados** (solo si no usas Firebase Hosting): *Authentication → Settings → Dominios autorizados* → agrega el dominio donde subas la tienda.
7. **Storage** (para subir imágenes desde el panel): *Compilación → Storage → Comenzar*. Las reglas están en `storage.rules`.
8. Publica con Firebase Hosting: `firebase deploy` (sube la tienda y las reglas de Firestore y Storage juntas).
9. Abre `admin.html`, inicia sesión y carga el inventario (ver más abajo).

## Panel de administración

Abre `admin.html` (o el enlace "Administrar" al pie de la tienda) e inicia sesión con tu usuario de Firebase.

- **Pedidos**: llegan en tiempo real cuando un cliente confirma por WhatsApp. Cambia el estado (nuevo, atendido, entregado, cancelado) y ve las ventas del día.
- **Productos**: crear, editar, duplicar, ordenar, activar/desactivar y borrar. Precio editable en línea en la tabla. Nombre en español e inglés, categoría, unidad, precio, precio anterior (para mostrar oferta), emoji, URL de imagen o subida a Storage. Importación masiva por CSV.
- **Categorías**: categorías y unidades de venta, cada una con nombre en los dos idiomas.
- **Tienda**: nombre, lema, WhatsApp, moneda, delivery, monto de la yapa, dirección, medios de pago, horario y días. Y **Apariencia**: colores principal, de acento y de resalte, letra de títulos y letra del texto, con vista previa.
- **Datos**: copia de seguridad en JSON, importar copia, cargar el catálogo de ejemplo.

Todo cambio se guarda en Firebase y se ve al instante en la tienda, en cualquier dispositivo.

## Tema e idioma

- El botón de sol/luna alterna entre fondo blanco y fondo negro. Si no se toca, sigue la preferencia del sistema.
- El selector ES / EN cambia todos los textos, incluidos productos, categorías y unidades.
- Ambas preferencias se recuerdan en el navegador y aplican también en el panel.

## Modelo de datos en Firestore

Proyecto `elmercadodeas`, base de datos `(default)`. La tienda lee todo en tiempo real (`onSnapshot`) con caché local, así que funciona sin conexión con la última copia.

| Ruta | Campos | Quién escribe |
| --- | --- | --- |
| `tienda/config` | `nombre`, `lema{es,en}`, `whatsapp` (solo dígitos con código de país), `moneda`, `delivery`, `metaYapa`, `horaAbre`, `horaCierra`, `horaLimite` (hora límite de pedidos, opcional; si falta se usa `horaCierra`), `dias[]` (0 = domingo … 6 = sábado), `direccion{es,en}`, `pagos`, `apariencia{primario, acento, resalte, fuenteTitulos, fuenteTexto}` | Panel → Tienda |
| `tienda/catalogo` | `categorias[{id, es, en, sub[{id, es, en}]}]` (subcategorías opcionales), `unidades[{id, es, en, paso}]` (`paso` = cuánto suma cada +/−: 0.25 kg, 100 g, 1 unidad) | Panel → Categorías |
| `productos/{id}` | `es`, `en`, `cat` (id de categoría), `sub` (id de subcategoría o `null`), `unidad` (id de unidad), `precio`, `antes` (precio anterior, `null` si no hay oferta), `oferta` (bool, marca "Ofertas de hoy" aunque no tenga precio anterior), `icono` (emoji de respaldo), `imagen` (URL o archivo en Storage), `activo` (bool; solo los activos se muestran), `orden` (número) | Panel → Productos / Importar |
| `pedidos/{id}` | `nombre`, `modo` (`delivery` / `recojo`), `direccion`, `items[{id, nombre, n, unidad, precio}]`, `subtotal`, `delivery`, `total`, `yapa`, `moneda`, `idioma`, `estado` (`nuevo` / `atendido` / `entregado` / `cancelado`), `creado` (timestamp) | La tienda crea; el panel gestiona |

- El `id` de producto es el nombre en español en minúsculas y sin tildes (`palta-fuerte`). Si ya existe, se agrega `-2`, `-3`…
- Orden público: por categoría (según el orden de la pestaña Categorías), luego subcategoría y luego `orden`.
- Unidades incluidas: kg, medio kilo, g, libra, arroba, saco, litro, ml, galón, botella, unidad, docena, media docena, atado, racimo, paquete, bolsa, malla, caja, bandeja, lata, frasco, sobre y porción. En un catálogo ya cargado se suman con **Categorías → Agregar unidades comunes**.
- Los nombres en inglés se completan solos al escribir en español (diccionario local de mercado + servicio MyMemory). **Datos → Traducir al inglés lo que falta** completa los existentes.
- `visible` es el nombre antiguo de `activo`; la tienda acepta ambos y el panel escribe los dos.
- Las imágenes subidas desde el panel van a Storage en `productos/{id}-{timestamp}.{ext}` (máx. 2 MB, `storage.rules`).

## Cargar el inventario

Tres formas, de la más rápida a la más completa:

1. **Panel → Datos → Cargar catálogo de ejemplo.** 43 productos, incluidos los 23 del volante "Verduras a domicilio" con sus precios. Solo agrega lo que falte: no toca tu nombre, WhatsApp, colores, fotos ni tus categorías propias. El mismo volante está en `scripts/verduras-a-domicilio.csv` para importarlo por CSV.
2. **Panel → Productos → Importar productos.** Sube un CSV o pega filas con el formato `nombre, categoría, precio, unidad, oferta (sí/no), url de imagen, subcategoría (opcional)`. Hay una plantilla descargable con 3 filas. Muestra cuántos se importaron y qué filas fallaron y por qué. Si el nombre ya existe, actualiza ese producto.
3. **Desde Cloud Shell**, sin abrir el panel:
   ```
   cd ElMercado && node scripts/seed.mjs
   ```
   Usa la sesión de `gcloud` y escribe el catálogo de ejemplo por la API REST de Firestore.

Después, los **precios se cambian en línea** en la tabla de Productos (escribe y pulsa Enter o sal del campo) y cada producto se **activa o desactiva** con su interruptor sin borrarlo.

## Seguridad

- Las claves de `firebase-config.js` son públicas por diseño; lo que protege los datos son las reglas de `firestore.rules`.
- Solo un usuario autenticado puede escribir productos y configuración, o leer y gestionar pedidos.
- Cualquiera puede crear un pedido (es lo que hace la tienda al confirmar), con límites de tamaño.

## Estados de la tienda

- **Cargando**: tarjetas skeleton animadas hasta que Firebase responde. Nunca se muestra "0 productos" mientras carga.
- **Sin productos**: el catálogo está vacío o no hay activos.
- **Error de conexión**: si Firestore falla (sin red, reglas), aparece un aviso con botón **Reintentar** que vuelve a suscribirse. El detalle del error se imprime en la consola con el prefijo `[Firestore]`.
- **Horario**: se calcula con la hora real de Lima (`America/Lima`): "Abierto ahora · pedidos hasta las…" o "Cerrado · abrimos mañana a las…".

## PWA y compartir

- `manifest.json` + `sw.js`: instalable en el teléfono; el shell se sirve desde caché y los datos de Firebase siempre van por red. Aparece un banner "Instalar app" cuando el navegador lo permite; se puede cerrar y no vuelve a molestar.
- Open Graph y Twitter Card en `index.html` con `img/og.png` (1200×630), para que el enlace se vea bien en WhatsApp y redes.
