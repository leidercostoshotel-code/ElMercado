/* ============================================================
   El Mercado de Amazonas · Textos en español e inglés
   ============================================================ */
export const I18N = {
  es: {
    /* navegación */
    nav_tienda: "Tienda", nav_como: "Cómo pedir", nav_yapa: "Yapa",
    abrir_carrito: "Abrir canasta", tema: "Cambiar tema", idioma: "Cambiar idioma",
    /* hero */
    abierto: "Abierto ahora · pedidos hasta las {h}",
    cerrado: "Cerrado por hoy · entregamos el próximo día hábil",
    hero_titulo: "Del mercado a tu mesa, fresquito.",
    hero_texto: "Frutas, verduras, carnes y abarrotes elegidos esta madrugada en el mayorista. Arma tu canasta, confírmala por WhatsApp y te la llevamos el mismo día.",
    hero_cta: "Armar mi canasta", hero_cta2: "¿Cómo funciona?",
    marquee_yapa: "Yapa gratis desde {m}", marquee_delivery: "Delivery {m} el mismo día",
    oferta_linea: "{n} a {p} el {u} (antes {a})",
    /* tienda */
    tienda_titulo: "Elige lo de hoy", tienda_sub: "Precios del día · se pesa y se cobra lo justo",
    n_productos: "{n} productos", un_producto: "1 producto",
    buscar: "Busca palta, pollo, arroz…", cat_todo: "Todo", cat_ofertas: "Ofertas",
    por: "por {u}", oferta: "Oferta", agregar: "Agregar", quitar_uno: "Quitar uno", agregar_uno: "Agregar uno",
    sin_resultados: "No encontramos “{q}”", sin_resultados_sub: "Prueba con otro nombre o escríbenos por WhatsApp y lo conseguimos.",
    sin_productos: "Todavía no hay productos", sin_productos_sub: "Vuelve en un rato, estamos actualizando la lista de hoy.",
    /* cómo pedir */
    como_titulo: "Pedir toma un minuto",
    paso1_t: "Arma tu canasta", paso1_p: "Toca “Agregar” en lo que necesites. Puedes pedir por kilo, unidad o atado.",
    paso2_t: "Confirma por WhatsApp", paso2_p: "Tu pedido llega listo a nuestro chat. Ahí coordinamos el pago: Yape, Plin o efectivo.",
    paso3_t: "Recíbelo hoy", paso3_p: "Pasas por el puesto o te lo llevamos. Si algo no está fresco, lo cambiamos sin preguntas.",
    /* yapa */
    yapa_titulo: "Pasa de {m} y te llevas yapa",
    yapa_texto: "Como en el mercado de siempre: un puñado de culantro, un par de limones o lo que nos dé la mañana. Cortesía de la casa.",
    yapa_falta: "Te faltan {m} para tu yapa", yapa_lista: "¡Yapa asegurada! Te llevas algo extra de la casa", yapa_ganaste: "¡Ganaste tu yapa!",
    /* pie */
    horario: "Lunes a viernes, {a} a {c}", horario_dias: "{d}, {a} a {c}",
    pagos: "Pagos", admin: "Administrar", hecho: "Hecho con cariño en el mercado.",
    /* carrito */
    canasta: "Tu canasta", cerrar: "Cerrar", subtotal: "Subtotal", delivery: "Delivery", recojo: "Recojo en puesto",
    gratis: "Gratis", total: "Total", tu_nombre: "Tu nombre", ej_nombre: "Ej. María", direccion: "Dirección de entrega",
    ej_direccion: "Calle, número, referencia", confirmar: "Confirmar pedido por WhatsApp",
    nota: "El precio final se ajusta al peso real. No se cobra hasta que recibes.",
    canasta_vacia: "Tu canasta está vacía", canasta_vacia_sub: "Empieza por las ofertas de hoy",
    en_canasta: "{n} en tu canasta", falta_nombre: "Cuéntanos tu nombre", falta_direccion: "Falta la dirección de entrega",
    /* mensaje WhatsApp */
    wa_pedido: "Pedido {tienda}", wa_recojo: "Recojo en el puesto", wa_yapa: "Con yapa", wa_pago: "Pago: {p} — me avisan por acá",
    /* días */
    dias: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dias_corto: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],


    /* ---------- estados de carga ---------- */
    cargando: "Cargando la tienda…", error_datos: "No pudimos cargar la tienda. Revisa tu conexión e inténtalo de nuevo.",
    setup_t: "Falta conectar Firebase", setup_p: "Esta tienda guarda sus datos en Firebase. Abre js/firebase-config.js, pega los datos de tu proyecto y vuelve a cargar la página. El archivo README.md explica cada paso.",
    pedido_guardado: "Pedido registrado. Confírmalo en WhatsApp",
    /* ---------- acceso al panel (Firebase Auth) ---------- */
    p_login_p: "Inicia sesión con el usuario que creaste en Firebase Authentication.",
    p_email: "Correo", p_clave: "Contraseña", p_entrando: "Entrando…",
    p_login_err: "Correo o contraseña incorrectos", p_login_err_red: "Sin conexión. Inténtalo de nuevo.", p_login_err_muchos: "Demasiados intentos. Espera unos minutos.",
    p_permiso: "No tienes permiso para guardar. Revisa las reglas de Firestore.", p_error: "Ocurrió un error al guardar",
    /* ---------- pedidos ---------- */
    p_tab_pedidos: "Pedidos", p_sin_pedidos: "Todavía no hay pedidos.", p_pedidos_hoy: "{n} pedidos hoy · {t} en ventas",
    p_estado_nuevo: "Nuevo", p_estado_atendido: "Atendido", p_estado_entregado: "Entregado", p_estado_cancelado: "Cancelado",
    p_pedido_de: "Pedido de {n}", p_borrar_pedido: "¿Borrar este pedido?", p_filtro_todos: "Todos",
    /* ---------- apariencia ---------- */
    p_apariencia: "Apariencia", p_apariencia_p: "Cambia el nombre, las letras y los colores. Se aplica al instante en la tienda.",
    p_color_primario: "Color principal (cabecera, botones)", p_color_acento: "Color de acento (ofertas, yapa)", p_color_resalte: "Color de resalte (canasta, avisos)",
    p_fuente_titulos: "Letra de títulos", p_fuente_texto: "Letra del texto", p_vista_previa: "Vista previa", p_restaurar_colores: "Volver a los colores originales",
    /* ---------- datos ---------- */
    p_tab_datos: "Datos", p_datos_t: "Datos en Firebase", p_datos_p: "Todo lo que cambias en el panel se guarda en Firebase y lo ven tus clientes al instante, en cualquier dispositivo.",
    p_datos_estado: "{n} productos · {c} categorías · {p} pedidos", p_sembrar: "Cargar catálogo de ejemplo", p_sembrar_confirmar: "Esto escribirá el catálogo de ejemplo en Firebase (sobrescribe productos con el mismo id). ¿Continuar?",
    p_sembrar_ok: "Catálogo de ejemplo cargado", p_exportar: "Descargar copia (JSON)", p_importar: "Importar copia (JSON)", p_importar_confirmar: "Se escribirán {n} productos y la configuración en Firebase. ¿Continuar?",
    p_importado: "Copia importada", p_import_err: "El archivo no es una copia válida",
    /* ---------- panel ---------- */
    p_titulo: "Panel", p_ver_tienda: "Ver tienda", p_salir: "Salir",
    p_login_t: "Acceso al panel", p_login_p: "Escribe el PIN para administrar productos, precios y datos de la tienda.", p_entrar: "Entrar",
    p_tab_productos: "Productos", p_tab_categorias: "Categorías", p_tab_tienda: "Tienda", p_tab_publicar: "Publicar",
    p_buscar: "Buscar producto…", p_nuevo: "Nuevo producto", p_todas: "Todas las categorías",
    p_col_prod: "Producto", p_col_cat: "Categoría", p_col_precio: "Precio", p_col_antes: "Antes", p_col_visible: "Visible", p_col_acciones: "Acciones",
    p_editar: "Editar", p_borrar: "Borrar", p_subir: "Subir", p_bajar: "Bajar", p_duplicar: "Duplicar",
    p_confirmar_borrar: "¿Borrar “{n}”? Esta acción no se puede deshacer.",
    p_form_nuevo: "Nuevo producto", p_form_editar: "Editar producto",
    p_nombre_es: "Nombre en español", p_nombre_en: "Nombre en inglés", p_categoria: "Categoría", p_icono: "Emoji o ícono",
    p_imagen: "URL de imagen (opcional)", p_precio: "Precio", p_antes: "Precio anterior (si hay oferta)", p_unidad: "Unidad",
    p_visible: "Mostrar en la tienda", p_guardar: "Guardar", p_cancelar: "Cancelar",
    p_err_nombre: "Falta el nombre en español", p_err_precio: "El precio debe ser mayor a 0", p_err_antes: "El precio anterior debe ser mayor al precio actual",
    p_guardado: "Guardado", p_borrado: "Producto borrado", p_sin_productos: "No hay productos. Crea el primero.",
    p_resumen: "{n} productos · {v} visibles · {o} en oferta",
    p_cat_nombre_es: "Nombre en español", p_cat_nombre_en: "Nombre en inglés", p_cat_nueva: "Nueva categoría", p_cat_agregar: "Agregar",
    p_cat_en_uso: "No se puede borrar: {n} productos usan esta categoría.", p_cat_confirmar: "¿Borrar la categoría “{n}”?",
    p_unidades: "Unidades de venta", p_unidad_nueva: "Nueva unidad", p_unidad_en_uso: "No se puede borrar: {n} productos usan esta unidad.",
    p_tienda_datos: "Datos de la tienda", p_tienda_nombre: "Nombre de la tienda", p_tienda_lema_es: "Lema en español", p_tienda_lema_en: "Lema en inglés",
    p_tienda_wa: "WhatsApp (con código de país, solo números)", p_tienda_moneda: "Símbolo de moneda", p_tienda_delivery: "Costo de delivery",
    p_tienda_yapa: "Monto mínimo para la yapa", p_tienda_direccion_es: "Dirección en español", p_tienda_direccion_en: "Dirección en inglés",
    p_tienda_pagos: "Medios de pago", p_tienda_horario: "Horario de atención", p_tienda_abre: "Abre", p_tienda_cierra: "Cierra", p_tienda_dias: "Días de atención",
    p_pub_t: "Publicar cambios", p_pub_p: "Los cambios que haces aquí se guardan en este navegador y se ven al instante en la tienda de este mismo equipo. Para que los vean todos tus clientes, descarga el archivo y reemplaza js/data.js en tu hosting.",
    p_pub_descargar: "Descargar data.js", p_pub_exportar: "Exportar copia (JSON)", p_pub_importar: "Importar copia (JSON)",
    p_pub_reset: "Restablecer a valores de fábrica", p_pub_reset_confirmar: "¿Restablecer todo? Se perderán los cambios guardados en este navegador.",
    p_pub_importado: "Copia importada", p_pub_import_err: "El archivo no es una copia válida", p_pub_estado_local: "Tienes cambios guardados en este navegador.", p_pub_estado_limpio: "La tienda está usando los datos publicados en data.js.",
    p_pub_pasos: "Cómo publicar", p_pub_paso1: "Descarga data.js con el botón de arriba.", p_pub_paso2: "Sube el archivo a la carpeta js/ de tu hosting (reemplaza el existente).", p_pub_paso3: "Listo. Recarga la tienda y verás los cambios en cualquier dispositivo."
  },
  en: {
    nav_tienda: "Shop", nav_como: "How it works", nav_yapa: "Yapa",
    abrir_carrito: "Open basket", tema: "Toggle theme", idioma: "Switch language",
    abierto: "Open now · orders until {h}",
    cerrado: "Closed for today · we deliver the next business day",
    hero_titulo: "From the market to your table, fresh.",
    hero_texto: "Fruit, vegetables, meat and pantry staples hand-picked at dawn from the wholesale market. Build your basket, confirm on WhatsApp and get it the same day.",
    hero_cta: "Build my basket", hero_cta2: "How it works",
    marquee_yapa: "Free yapa on orders over {m}", marquee_delivery: "Same-day delivery {m}",
    oferta_linea: "{n} at {p} per {u} (was {a})",
    tienda_titulo: "Today’s picks", tienda_sub: "Daily prices · weighed and charged fairly",
    n_productos: "{n} products", un_producto: "1 product",
    buscar: "Search avocado, chicken, rice…", cat_todo: "All", cat_ofertas: "Deals",
    por: "per {u}", oferta: "Deal", agregar: "Add", quitar_uno: "Remove one", agregar_uno: "Add one",
    sin_resultados: "No results for “{q}”", sin_resultados_sub: "Try another name or message us on WhatsApp and we’ll find it.",
    sin_productos: "No products yet", sin_productos_sub: "Check back soon, we’re updating today’s list.",
    como_titulo: "Ordering takes a minute",
    paso1_t: "Build your basket", paso1_p: "Tap “Add” on anything you need. Order by kilo, unit or bunch.",
    paso2_t: "Confirm on WhatsApp", paso2_p: "Your order lands ready in our chat. We settle payment there: Yape, Plin or cash.",
    paso3_t: "Get it today", paso3_p: "Pick it up at the stall or we bring it to you. If anything isn’t fresh, we swap it, no questions asked.",
    yapa_titulo: "Spend over {m} and get a yapa",
    yapa_texto: "Just like the neighbourhood market: a handful of cilantro, a couple of limes or whatever the morning gives us. On the house.",
    yapa_falta: "{m} more to earn your yapa", yapa_lista: "Yapa secured! You’re getting something extra on the house", yapa_ganaste: "You earned your yapa!",
    horario: "Monday to Friday, {a} to {c}", horario_dias: "{d}, {a} to {c}",
    pagos: "Payments", admin: "Manage", hecho: "Made with care at the market.",
    canasta: "Your basket", cerrar: "Close", subtotal: "Subtotal", delivery: "Delivery", recojo: "Pick up at stall",
    gratis: "Free", total: "Total", tu_nombre: "Your name", ej_nombre: "e.g. Maria", direccion: "Delivery address",
    ej_direccion: "Street, number, landmark", confirmar: "Confirm order on WhatsApp",
    nota: "Final price adjusts to the real weight. You’re not charged until you receive it.",
    canasta_vacia: "Your basket is empty", canasta_vacia_sub: "Start with today’s deals",
    en_canasta: "{n} added to your basket", falta_nombre: "Tell us your name", falta_direccion: "Delivery address is missing",
    wa_pedido: "{tienda} order", wa_recojo: "Pick up at the stall", wa_yapa: "With yapa", wa_pago: "Payment: {p} — let me know here",
    dias: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dias_corto: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],


    cargando: "Loading the shop…", error_datos: "We couldn’t load the shop. Check your connection and try again.",
    setup_t: "Firebase is not connected yet", setup_p: "This shop keeps its data in Firebase. Open js/firebase-config.js, paste your project settings and reload the page. README.md explains each step.",
    pedido_guardado: "Order saved. Confirm it on WhatsApp",
    p_login_p: "Sign in with the user you created in Firebase Authentication.",
    p_email: "Email", p_clave: "Password", p_entrando: "Signing in…",
    p_login_err: "Wrong email or password", p_login_err_red: "No connection. Try again.", p_login_err_muchos: "Too many attempts. Wait a few minutes.",
    p_permiso: "You don’t have permission to save. Check the Firestore rules.", p_error: "Something went wrong while saving",
    p_tab_pedidos: "Orders", p_sin_pedidos: "No orders yet.", p_pedidos_hoy: "{n} orders today · {t} in sales",
    p_estado_nuevo: "New", p_estado_atendido: "Handled", p_estado_entregado: "Delivered", p_estado_cancelado: "Cancelled",
    p_pedido_de: "Order from {n}", p_borrar_pedido: "Delete this order?", p_filtro_todos: "All",
    p_apariencia: "Appearance", p_apariencia_p: "Change the name, fonts and colors. Applies instantly in the shop.",
    p_color_primario: "Primary color (header, buttons)", p_color_acento: "Accent color (deals, yapa)", p_color_resalte: "Highlight color (basket, toasts)",
    p_fuente_titulos: "Heading font", p_fuente_texto: "Body font", p_vista_previa: "Preview", p_restaurar_colores: "Restore original colors",
    p_tab_datos: "Data", p_datos_t: "Data in Firebase", p_datos_p: "Everything you change here is saved in Firebase and your customers see it instantly, on any device.",
    p_datos_estado: "{n} products · {c} categories · {p} orders", p_sembrar: "Load sample catalog", p_sembrar_confirmar: "This writes the sample catalog to Firebase (overwrites products with the same id). Continue?",
    p_sembrar_ok: "Sample catalog loaded", p_exportar: "Download backup (JSON)", p_importar: "Import backup (JSON)", p_importar_confirmar: "{n} products and the settings will be written to Firebase. Continue?",
    p_importado: "Backup imported", p_import_err: "That file is not a valid backup",
    p_titulo: "Dashboard", p_ver_tienda: "View shop", p_salir: "Sign out",
    p_login_t: "Dashboard access", p_login_p: "Enter the PIN to manage products, prices and shop details.", p_entrar: "Sign in",
    p_tab_productos: "Products", p_tab_categorias: "Categories", p_tab_tienda: "Shop", p_tab_publicar: "Publish",
    p_buscar: "Search product…", p_nuevo: "New product", p_todas: "All categories",
    p_col_prod: "Product", p_col_cat: "Category", p_col_precio: "Price", p_col_antes: "Was", p_col_visible: "Visible", p_col_acciones: "Actions",
    p_editar: "Edit", p_borrar: "Delete", p_subir: "Move up", p_bajar: "Move down", p_duplicar: "Duplicate",
    p_confirmar_borrar: "Delete “{n}”? This cannot be undone.",
    p_form_nuevo: "New product", p_form_editar: "Edit product",
    p_nombre_es: "Name in Spanish", p_nombre_en: "Name in English", p_categoria: "Category", p_icono: "Emoji or icon",
    p_imagen: "Image URL (optional)", p_precio: "Price", p_antes: "Previous price (if on sale)", p_unidad: "Unit",
    p_visible: "Show in shop", p_guardar: "Save", p_cancelar: "Cancel",
    p_err_nombre: "Spanish name is required", p_err_precio: "Price must be greater than 0", p_err_antes: "Previous price must be higher than the current price",
    p_guardado: "Saved", p_borrado: "Product deleted", p_sin_productos: "No products. Create the first one.",
    p_resumen: "{n} products · {v} visible · {o} on sale",
    p_cat_nombre_es: "Name in Spanish", p_cat_nombre_en: "Name in English", p_cat_nueva: "New category", p_cat_agregar: "Add",
    p_cat_en_uso: "Cannot delete: {n} products use this category.", p_cat_confirmar: "Delete category “{n}”?",
    p_unidades: "Selling units", p_unidad_nueva: "New unit", p_unidad_en_uso: "Cannot delete: {n} products use this unit.",
    p_tienda_datos: "Shop details", p_tienda_nombre: "Shop name", p_tienda_lema_es: "Tagline in Spanish", p_tienda_lema_en: "Tagline in English",
    p_tienda_wa: "WhatsApp (with country code, digits only)", p_tienda_moneda: "Currency symbol", p_tienda_delivery: "Delivery fee",
    p_tienda_yapa: "Minimum amount for the yapa", p_tienda_direccion_es: "Address in Spanish", p_tienda_direccion_en: "Address in English",
    p_tienda_pagos: "Payment methods", p_tienda_horario: "Opening hours", p_tienda_abre: "Opens", p_tienda_cierra: "Closes", p_tienda_dias: "Open days",
    p_pub_t: "Publish changes", p_pub_p: "Changes made here are saved in this browser and show instantly in the shop on this same device. To make them visible to all your customers, download the file and replace js/data.js on your hosting.",
    p_pub_descargar: "Download data.js", p_pub_exportar: "Export backup (JSON)", p_pub_importar: "Import backup (JSON)",
    p_pub_reset: "Reset to factory defaults", p_pub_reset_confirmar: "Reset everything? Changes saved in this browser will be lost.",
    p_pub_importado: "Backup imported", p_pub_import_err: "That file is not a valid backup", p_pub_estado_local: "You have changes saved in this browser.", p_pub_estado_limpio: "The shop is using the data published in data.js.",
    p_pub_pasos: "How to publish", p_pub_paso1: "Download data.js with the button above.", p_pub_paso2: "Upload it to the js/ folder on your hosting (replace the existing file).", p_pub_paso3: "Done. Reload the shop and the changes appear on every device."
  }
};

/* t("clave", {var: valor}) → texto en el idioma activo */
export function t(clave, vars) {
  const idioma = document.documentElement.lang === "en" ? "en" : "es";
  let s = (I18N[idioma] && I18N[idioma][clave]) ?? I18N.es[clave] ?? clave;
  if (typeof s !== "string") return s;
  if (vars) for (const k in vars) s = s.replaceAll("{" + k + "}", vars[k]);
  return s;
}
