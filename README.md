# LEITIME · Tu mercado, a tu puerta

Tienda web de un puesto de mercado: catálogo con precios del día, canasta de compras y pedido por WhatsApp.
Funciona sin servidor: son archivos estáticos que puedes subir a cualquier hosting (GitHub Pages, Netlify, Vercel, cPanel…).

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `index.html` | La tienda. Solo 19 líneas: toda la interfaz se construye desde JavaScript. |
| `admin.html` | El panel de administración. También 19 líneas. |
| `css/styles.css` | Estilos de la tienda y del panel. Tema claro (fondo blanco) y oscuro (fondo negro). |
| `js/data.js` | Catálogo y configuración publicados: productos, precios, categorías, WhatsApp, horario, PIN. |
| `js/i18n.js` | Todos los textos en español e inglés. |
| `js/store.js` | Guardado en el navegador y utilidades compartidas. |
| `js/app.js` | Lógica de la tienda: catálogo, búsqueda, canasta, yapa, WhatsApp, tema e idioma. |
| `js/admin.js` | Lógica del panel: productos, categorías, unidades, datos de la tienda y publicación. |

## Tema e idioma

- El botón de sol/luna alterna entre fondo blanco y fondo negro. Si no se toca, sigue la preferencia del sistema.
- El selector ES / EN cambia todos los textos, incluidos los nombres de productos, categorías y unidades.
- Ambas preferencias se recuerdan en el navegador y aplican también en el panel.

## Panel de administración

Abre `admin.html` (o el enlace "Administrar" al pie de la tienda). PIN inicial: **1234**. Cámbialo en la pestaña **Tienda**.

- **Productos**: crear, editar, duplicar, ordenar, ocultar y borrar. Cada producto tiene nombre en español e inglés, categoría, unidad, precio, precio anterior (para mostrar oferta), emoji o URL de imagen.
- **Categorías**: categorías y unidades de venta, cada una con nombre en los dos idiomas.
- **Tienda**: nombre, lema, número de WhatsApp, moneda, costo de delivery, monto para la yapa, dirección, medios de pago, horario y días de atención, PIN.
- **Publicar**: descarga de `data.js`, copia de seguridad en JSON, importar copia, restablecer.

### Cómo se publican los cambios

Los cambios del panel se guardan en el navegador donde los haces y se ven al instante en la tienda de ese mismo equipo.
Para que los vean todos los clientes:

1. En la pestaña **Publicar**, pulsa **Descargar data.js**.
2. Sube ese archivo a la carpeta `js/` de tu hosting reemplazando el existente.
3. Recarga la tienda. Los cambios ya se ven en cualquier dispositivo.

> El PIN protege el panel frente a curiosos, pero al ser un sitio estático no es una barrera de seguridad real: cualquiera con acceso al archivo puede leerlo. No guardes datos sensibles en el panel.

## Personalizar

- Número de WhatsApp, delivery y yapa: pestaña **Tienda** del panel, o directamente en `js/data.js`.
- Colores: variables al inicio de `css/styles.css` (`--verde`, `--tomate`, `--mango`, `--palta`).
- Textos: `js/i18n.js`.
