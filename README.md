# El Mercado de Amazonas · Tu mercado, a tu puerta

Tienda web de un puesto de mercado: catálogo con precios del día, canasta, pedido por WhatsApp y panel de administración.
Los datos (productos, precios, configuración, apariencia y pedidos) viven en **Firebase (Firestore)** y se actualizan en tiempo real.
No hay contenido en HTML estático: `index.html` y `admin.html` tienen 19 líneas cada uno y toda la interfaz se construye desde JavaScript.

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `index.html` | La tienda (19 líneas). |
| `admin.html` | El panel de administración (19 líneas). |
| `css/styles.css` | Estilos. Tema claro (fondo blanco) y oscuro (fondo negro). Colores y letras se cambian desde el panel. |
| `js/firebase-config.js` | **Aquí pegas los datos de tu proyecto de Firebase.** |
| `js/db.js` | Capa de datos: Firestore en tiempo real y Firebase Auth. |
| `js/app.js` | Lógica de la tienda: catálogo, búsqueda, canasta, yapa, pedido, tema e idioma. |
| `js/admin.js` | Lógica del panel: pedidos, productos, categorías, unidades, tienda, apariencia y datos. |
| `js/i18n.js` | Todos los textos en español e inglés. |
| `js/store.js` | Preferencias del navegador (tema, idioma, canasta) y utilidades. |
| `js/data.js` | Catálogo de ejemplo para arrancar un proyecto vacío. |
| `firestore.rules` | Reglas de seguridad de Firestore. |
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
7. Sube los archivos a tu hosting. Con Firebase Hosting: `npm i -g firebase-tools`, `firebase login`, `firebase init hosting` (carpeta pública `.`), `firebase deploy`.
8. Abre `admin.html`, inicia sesión y en la pestaña **Datos** pulsa **Cargar catálogo de ejemplo**. La tienda se llena al instante.

## Panel de administración

Abre `admin.html` (o el enlace "Administrar" al pie de la tienda) e inicia sesión con tu usuario de Firebase.

- **Pedidos**: llegan en tiempo real cuando un cliente confirma por WhatsApp. Cambia el estado (nuevo, atendido, entregado, cancelado) y ve las ventas del día.
- **Productos**: crear, editar, duplicar, ordenar, ocultar y borrar. Nombre en español e inglés, categoría, unidad, precio, precio anterior (para mostrar oferta), emoji o URL de imagen.
- **Categorías**: categorías y unidades de venta, cada una con nombre en los dos idiomas.
- **Tienda**: nombre, lema, WhatsApp, moneda, delivery, monto de la yapa, dirección, medios de pago, horario y días. Y **Apariencia**: colores principal, de acento y de resalte, letra de títulos y letra del texto, con vista previa.
- **Datos**: copia de seguridad en JSON, importar copia, cargar el catálogo de ejemplo.

Todo cambio se guarda en Firebase y se ve al instante en la tienda, en cualquier dispositivo.

## Tema e idioma

- El botón de sol/luna alterna entre fondo blanco y fondo negro. Si no se toca, sigue la preferencia del sistema.
- El selector ES / EN cambia todos los textos, incluidos productos, categorías y unidades.
- Ambas preferencias se recuerdan en el navegador y aplican también en el panel.

## Estructura de datos en Firestore

```
tienda/config      nombre, lema{es,en}, whatsapp, moneda, delivery, metaYapa, horaAbre, horaCierra,
                   dias[], direccion{es,en}, pagos, apariencia{primario, acento, resalte, fuenteTitulos, fuenteTexto}
tienda/catalogo    categorias[{id,es,en}], unidades[{id,es,en}]
productos/{id}     es, en, cat, unidad, precio, antes, icono, imagen, visible, orden
pedidos/{id}       nombre, modo, direccion, items[], subtotal, delivery, total, yapa, estado, creado
```

## Seguridad

- Las claves de `firebase-config.js` son públicas por diseño; lo que protege los datos son las reglas de `firestore.rules`.
- Solo un usuario autenticado puede escribir productos y configuración, o leer y gestionar pedidos.
- Cualquiera puede crear un pedido (es lo que hace la tienda al confirmar), con límites de tamaño.
