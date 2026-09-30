/* ============================================================
   El Mercado de Amazonas · Panel de administración
   Pedidos, productos, categorías, unidades, datos de la tienda,
   apariencia y datos. Todo se guarda en Firebase (db.js).
   ============================================================ */
import { t } from "./i18n.js";
import { SEMILLA } from "./data.js";
import { esc, dinero, nombre, tema, idioma, slug, clone, fecha, favicon, ICON, FUENTES, APARIENCIA_BASE, aplicarApariencia, cargarFuentes } from "./store.js";
import * as db from "./db.js";
const activo = p => p.activo !== false && p.visible !== false;

favicon();
const $ = id => document.getElementById(id);
let D = null, pedidos = [], usuario = null, tab = "pedidos", fq = "", fcat = "", fest = "";
let estado = { listo: false }, unsubPedidos = null;
const lang = () => idioma.get();
const S = v => dinero(v, D?.config || SEMILLA.config);
const cfg = () => D.config;

/* ---------- errores de Firebase en lenguaje claro ---------- */
function fallo(e) {
  console.error(e);
  const code = e?.code || "";
  avisar(code.includes("permission") ? t("p_permiso") : t("p_error"));
}
const guardar = (promesa, msg = t("p_guardado")) => promesa.then(() => avisar(msg)).catch(fallo);

/* ---------- comunes ---------- */
const controles = () => `
  <div class="controles">
    <div class="lang" role="group" aria-label="${t("idioma")}"><button type="button" data-lang="es" aria-pressed="${lang() === "es"}">ES</button><button type="button" data-lang="en" aria-pressed="${lang() === "en"}">EN</button></div>
    <button type="button" class="icon-btn" id="btnTema" aria-label="${t("tema")}">${tema.get() === "dark" ? ICON.sol : ICON.luna}</button>
  </div>`;
function comunes() {
  if (!$("btnTema")) return;
  $("btnTema").onclick = () => { tema.set(tema.get() === "dark" ? "light" : "dark"); $("btnTema").innerHTML = tema.get() === "dark" ? ICON.sol : ICON.luna; };
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { if (lang() !== b.dataset.lang) { idioma.set(b.dataset.lang); montar(); } });
}
let tAviso;
function avisar(m) { let a = $("aviso"); if (!a) { a = document.createElement("div"); a.className = "aviso"; a.id = "aviso"; document.body.appendChild(a); } a.textContent = m; a.classList.add("ver"); clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove("ver"), 1800); }

/* ---------- pantallas ---------- */
function pantalla(html) { $("app").innerHTML = `<div class="pantalla"><div class="caja">${html}</div></div>`; comunes(); }

function login() {
  $("app").innerHTML = `
  <div class="login">
    <form id="formLogin">
      ${controles()}
      <a class="logo" href="index.html"><i></i>${esc(cfg().nombre)}<small>${t("p_titulo")}</small></a>
      <h1>${t("p_login_t")}</h1>
      <p>${t("p_login_p")}</p>
      <div class="campo"><label for="email">${t("p_email")}</label><input id="email" type="email" autocomplete="username" required></div>
      <div class="campo"><label for="clave">${t("p_clave")}</label><input id="clave" type="password" autocomplete="current-password" required></div>
      <div class="error" id="errLogin"></div>
      <button class="btn btn-verde" id="btnEntrar">${t("p_entrar")}</button>
      <p class="nota">${t("p_login_ayuda")}</p>
    </form>
  </div>`;
  comunes();
  $("formLogin").onsubmit = async e => {
    e.preventDefault();
    $("btnEntrar").disabled = true; $("btnEntrar").textContent = t("p_entrando"); $("errLogin").textContent = "";
    try { await db.login($("email").value.trim(), $("clave").value); }
    catch (err) {
      const c = err?.code || "";
      $("errLogin").textContent = c.includes("network") ? t("p_login_err_red") : c.includes("too-many") ? t("p_login_err_muchos") : t("p_login_err");
      $("btnEntrar").disabled = false; $("btnEntrar").textContent = t("p_entrar");
    }
  };
}

function montar() {
  document.documentElement.lang = lang();
  document.title = `${(D || SEMILLA).config.nombre} · ${t("p_titulo")}`;
  if (estado.sinFirebase) return pantalla(`${controles()}<div style="font-size:3rem">🔌</div><h1>${t("setup_t")}</h1><p>${t("setup_p")}</p>`);
  if (estado.error) return pantalla(`${controles()}<div style="font-size:3rem">⚠️</div><h1>${t("error_datos")}</h1><button type="button" class="btn btn-verde" onclick="location.reload()">↻</button>`);
  if (!estado.listo || usuario === undefined) return pantalla(`<div class="spinner"></div><p style="margin-top:1rem">${t("cargando")}</p>`);
  if (!usuario) return login();
  const tabs = ["pedidos", "productos", "categorias", "tienda", "datos"];
  $("app").innerHTML = `
  <div class="admin">
    <header class="top"><div class="wrap">
      <a class="logo" href="index.html"><i></i>${esc(cfg().nombre)}<small>${t("p_titulo")}</small></a>
      <nav class="nav"><a href="index.html" target="_blank" rel="noopener">${t("p_ver_tienda")} ↗</a></nav>
      ${controles()}
      <button type="button" class="icon-btn" id="btnSalir" aria-label="${t("p_salir")}" title="${t("p_salir")}">${ICON.salir}</button>
    </div></header>
    <main><div class="wrap">
      <div class="tabs" role="tablist">${tabs.map(x => `<button type="button" role="tab" data-tab="${x}" aria-selected="${x === tab}">${t("p_tab_" + x)}${x === "pedidos" && pedidos.some(p => p.estado === "nuevo") ? ` <span class="badge">${pedidos.filter(p => p.estado === "nuevo").length}</span>` : ""}</button>`).join("")}</div>
      <div id="vista"></div>
    </div></main>
  </div>
  <div class="aviso" id="aviso" role="status"></div>`;
  comunes();
  $("btnSalir").onclick = () => db.logout();
  document.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; montar(); });
  ({ pedidos: vistaPedidos, productos: vistaProductos, categorias: vistaCategorias, tienda: vistaTienda, datos: vistaDatos })[tab]();
}

/* ---------- pedidos ---------- */
function badgePedidos() {
  const b = document.querySelector('[data-tab="pedidos"]'); if (!b) return;
  const n = pedidos.filter(p => p.estado === "nuevo").length;
  b.innerHTML = t("p_tab_pedidos") + (n ? ` <span class="badge">${n}</span>` : "");
}
function vistaPedidos() {
  const estados = ["nuevo", "atendido", "entregado", "cancelado"];
  const hoy = new Date().toDateString();
  const deHoy = pedidos.filter(p => p.creado.toDateString() === hoy && p.estado !== "cancelado");
  const lista = pedidos.filter(p => !fest || p.estado === fest);
  $("vista").innerHTML = `
  <div class="tarjeta">
    <div class="herramientas">
      <p class="resumen-admin" style="margin:0;flex:1">${t("p_pedidos_hoy", { n: deHoy.length, t: S(deHoy.reduce((s, p) => s + p.total, 0)) })}</p>
      <select id="fest"><option value="">${t("p_filtro_todos")}</option>${estados.map(e => `<option value="${e}" ${e === fest ? "selected" : ""}>${t("p_estado_" + e)}</option>`).join("")}</select>
    </div>
    <div class="pedidos" id="listaPedidos">${lista.length ? lista.map(p => `
      <article class="pedido ${p.estado}" data-id="${esc(p.id)}">
        <div>
          <header><h3>${t("p_pedido_de", { n: esc(p.nombre) })}</h3><span class="estado-pill">${t("p_estado_" + p.estado)}</span><time>${fecha(p.creado)}</time></header>
          <ul>${(p.items || []).map(i => `<li>${esc(i.nombre)} × ${i.n} ${esc(i.unidad)} · ${S(i.precio * i.n)}</li>`).join("")}</ul>
          <div class="meta">${p.modo === "delivery" ? `🛵 ${t("delivery")} · 📍 ${esc(p.direccion)}` : `🏪 ${t("recojo")}`}${p.yapa ? " · 🎁 " + t("wa_yapa") : ""}</div>
        </div>
        <div>
          <div class="total-pedido">${S(p.total)}</div>
          <div class="acciones-pedido">
            <select data-estado="${esc(p.id)}" aria-label="Estado">${estados.map(e => `<option value="${e}" ${e === p.estado ? "selected" : ""}>${t("p_estado_" + e)}</option>`).join("")}</select>
            <button type="button" class="mini peligro" data-borra-pedido="${esc(p.id)}" title="${t("p_borrar")}">${ICON.basura}</button>
          </div>
        </div>
      </article>`).join("") : `<div class="vacio"><b>${t("p_sin_pedidos")}</b></div>`}
    </div>
  </div>`;
  $("fest").onchange = e => { fest = e.target.value; vistaPedidos(); };
  $("listaPedidos").onchange = e => { const s = e.target.closest("[data-estado]"); if (s) guardar(db.actualizarPedido(s.dataset.estado, { estado: s.value })); };
  $("listaPedidos").onclick = e => { const b = e.target.closest("[data-borra-pedido]"); if (b && confirm(t("p_borrar_pedido"))) guardar(db.borrarPedido(b.dataset.borraPedido), t("p_borrado")); };
}

/* ---------- productos ---------- */
function vistaProductos() {
  const L = lang();
  $("vista").innerHTML = `
  <div class="tarjeta">
    <div class="herramientas">
      <label class="buscar">${ICON.lupa}<input id="fq" type="search" placeholder="${t("p_buscar")}" value="${esc(fq)}"></label>
      <select id="fcat"><option value="">${t("p_todas")}</option>${D.categorias.map(c => `<option value="${c.id}" ${c.id === fcat ? "selected" : ""}>${esc(nombre(c, L))}</option>`).join("")}</select>
      <button type="button" class="btn btn-borde chico" id="btnImportar">⇪ ${t("p_importar_prod")}</button>
      <button type="button" class="btn btn-tomate chico" id="btnNuevo">+ ${t("p_nuevo")}</button>
    </div>
    <p class="resumen-admin" id="resumen"></p>
    <table class="tabla"><thead><tr><th>${t("p_col_prod")}</th><th>${t("p_col_cat")}</th><th>${t("p_col_precio")}</th><th>${t("p_col_activo")}</th><th></th></tr></thead><tbody id="filas"></tbody></table>
  </div>`;
  $("fq").oninput = e => { fq = e.target.value.trim().toLowerCase(); filas(); };
  $("fcat").onchange = e => { fcat = e.target.value; filas(); };
  $("btnNuevo").onclick = () => formulario();
  $("btnImportar").onclick = importar;
  filas();
}

function filas() {
  if (!$("filas")) return;
  const L = lang(), P = D.productos;
  $("resumen").textContent = t("p_resumen", { n: P.length, v: P.filter(activo).length, o: P.filter(p => p.antes > p.precio || p.oferta).length });
  const lista = P.map((p, i) => ({ p, i })).filter(({ p }) => (!fcat || p.cat === fcat) && (!fq || nombre(p, "es").toLowerCase().includes(fq) || nombre(p, "en").toLowerCase().includes(fq)));
  $("filas").innerHTML = lista.length ? lista.map(({ p, i }) => `
    <tr class="${activo(p) ? "" : "invisible"}">
      <td class="celda-prod"><div class="prod-celda"><span class="icono">${p.imagen ? `<img src="${esc(p.imagen)}" alt="" loading="lazy" width="35" height="35" onerror="this.parentElement.classList.add('fallo');this.remove()">` : ""}<span class="emoji">${esc(p.icono || "🛒")}</span></span><div><b>${esc(p.es)}</b><small>${esc(p.en || "")} · ${esc(nombre(D.unidades.find(u => u.id === p.unidad), L) || p.unidad)}</small></div></div></td>
      <td><span class="pill">${esc(nombre(D.categorias.find(c => c.id === p.cat), L) || p.cat)}</span></td>
      <td class="num"><span class="precio-inline"><input type="number" step="0.01" min="0.01" inputmode="decimal" value="${p.precio}" data-precio="${esc(p.id)}" aria-label="${t("p_precio_inline")}: ${esc(p.es)}"><button type="button" class="mini" data-ok-precio="${esc(p.id)}" title="${t("p_guardar")}" hidden>✓</button></span>${p.antes > p.precio ? ` <s>${S(p.antes)}</s>` : ""}</td>
      <td><label class="switch"><input type="checkbox" data-vis="${esc(p.id)}" ${activo(p) ? "checked" : ""} aria-label="${t("p_col_activo")}: ${esc(p.es)}"><i></i></label></td>
      <td><div class="acciones">
        <button type="button" class="mini" data-act="sube" data-i="${i}" title="${t("p_subir")}" ${i === 0 ? "disabled" : ""}>${ICON.arriba}</button>
        <button type="button" class="mini" data-act="baja" data-i="${i}" title="${t("p_bajar")}" ${i === P.length - 1 ? "disabled" : ""}>${ICON.abajo}</button>
        <button type="button" class="mini" data-act="dup" data-i="${i}" title="${t("p_duplicar")}">${ICON.copia}</button>
        <button type="button" class="mini" data-act="edita" data-i="${i}" title="${t("p_editar")}">${ICON.lapiz}</button>
        <button type="button" class="mini peligro" data-act="borra" data-i="${i}" title="${t("p_borrar")}">${ICON.basura}</button>
      </div></td>
    </tr>`).join("") : `<tr><td colspan="5"><div class="vacio"><b>${t("p_sin_productos")}</b></div></td></tr>`;
  $("filas").onclick = e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const i = +b.dataset.i, p = P[i], a = b.dataset.act;
    if (a === "edita") formulario(i);
    if (a === "dup") { const { id, ...datos } = clone(p); guardar(db.guardarProducto(idUnico(id), { ...datos, orden: (p.orden ?? i) + 0.5 })); }
    if (a === "sube" && i > 0) { const l = P.slice(); [l[i - 1], l[i]] = [l[i], l[i - 1]]; guardar(db.reordenar(l)); }
    if (a === "baja" && i < P.length - 1) { const l = P.slice(); [l[i + 1], l[i]] = [l[i], l[i + 1]]; guardar(db.reordenar(l)); }
    if (a === "borra" && confirm(t("p_confirmar_borrar", { n: p.es }))) guardar(db.borrarProducto(p.id), t("p_borrado"));
  };
  $("filas").onchange = e => {
    const c = e.target.closest("[data-vis]"); if (c) return guardar(db.guardarProducto(c.dataset.vis, { activo: c.checked, visible: c.checked }), c.checked ? t("p_activo_on") : t("p_activo_off"));
    const pr = e.target.closest("[data-precio]"); if (pr) guardarPrecio(pr);
  };
  $("filas").oninput = e => { const pr = e.target.closest("[data-precio]"); if (pr) pr.nextElementSibling.hidden = false; };
  $("filas").onkeydown = e => { const pr = e.target.closest("[data-precio]"); if (pr && e.key === "Enter") { e.preventDefault(); pr.blur(); } };
}
function guardarPrecio(inp) {
  const v = parseFloat(inp.value), p = D.productos.find(x => x.id === inp.dataset.precio);
  if (!(v > 0)) { inp.value = p?.precio ?? ""; return avisar(t("p_err_precio")); }
  if (p && v === p.precio) { inp.nextElementSibling.hidden = true; return; }
  if (p && p.antes && !(p.antes > v)) return guardar(db.guardarProducto(p.id, { precio: +v.toFixed(2), antes: null }));
  guardar(db.guardarProducto(inp.dataset.precio, { precio: +v.toFixed(2) })).then(() => { inp.nextElementSibling.hidden = true; });
}
/* tras duplicar, los "orden" quedan con decimales: se normalizan a enteros consecutivos */
const ordenados = () => db.ordenarProductos(D.productos, D.categorias);
function idUnico(base) { let id = slug(base), n = 2; while (D.productos.some(p => p.id === id)) id = slug(base) + "-" + n++; return id; }

function formulario(i) {
  const L = lang(), nuevo = i === undefined;
  const p = nuevo ? { es: "", en: "", cat: D.categorias[0]?.id || "", icono: "🛒", imagen: "", precio: "", antes: "", unidad: D.unidades[0]?.id || "kg", activo: true } : D.productos[i];
  const velo = document.createElement("div"); velo.className = "modal-velo";
  velo.innerHTML = `
  <form class="modal" id="formProd">
    <h2>${nuevo ? t("p_form_nuevo") : t("p_form_editar")}</h2>
    <div class="form-grid">
      <div class="campo"><label for="f_es">${t("p_nombre_es")}</label><input id="f_es" value="${esc(p.es)}" required></div>
      <div class="campo"><label for="f_en">${t("p_nombre_en")}</label><input id="f_en" value="${esc(p.en || "")}"></div>
      <div class="campo"><label for="f_cat">${t("p_categoria")}</label><select id="f_cat">${D.categorias.map(c => `<option value="${c.id}" ${c.id === p.cat ? "selected" : ""}>${esc(nombre(c, L))}</option>`).join("")}</select></div>
      <div class="campo"><label for="f_unidad">${t("p_unidad")}</label><select id="f_unidad">${D.unidades.map(u => `<option value="${u.id}" ${u.id === p.unidad ? "selected" : ""}>${esc(nombre(u, L))}</option>`).join("")}</select></div>
      <div class="campo"><label for="f_precio">${t("p_precio")} (${esc(cfg().moneda)})</label><input id="f_precio" type="number" step="0.01" min="0" inputmode="decimal" value="${p.precio}" required></div>
      <div class="campo"><label for="f_antes">${t("p_antes")}</label><input id="f_antes" type="number" step="0.01" min="0" inputmode="decimal" value="${p.antes ?? ""}"></div>
      <div class="campo"><label for="f_icono">${t("p_icono")}</label><div class="icono-preview"><span class="muestra" id="f_muestra"></span><input id="f_icono" value="${esc(p.icono || "")}" maxlength="8"></div></div>
      <div class="campo"><label for="f_imagen">${t("p_imagen")}</label><input id="f_imagen" type="url" value="${esc(p.imagen || "")}" placeholder="https://…"><div class="subir-img"><label class="btn btn-borde chico" for="f_archivo">${ICON.nube} ${t("p_imagen_subir")}</label><input type="file" id="f_archivo" accept="image/*" class="sr"><small id="f_subida"></small></div></div>
      <label class="campo ancho" style="flex-direction:row;align-items:center;gap:.8rem"><span class="switch"><input type="checkbox" id="f_visible" ${activo(p) ? "checked" : ""}><i></i></span>${t("p_visible")}</label>
    </div>
    <div class="error" id="f_error"></div>
    <div class="acciones-form"><button type="button" class="btn btn-borde" id="f_cancelar">${t("p_cancelar")}</button><button class="btn btn-verde">${t("p_guardar")}</button></div>
  </form>`;
  document.body.appendChild(velo);
  const muestra = () => { const img = $("f_imagen").value.trim(); $("f_muestra").innerHTML = img ? `<img src="${esc(img)}" alt="">` : esc($("f_icono").value || "🛒"); };
  $("f_icono").oninput = $("f_imagen").oninput = muestra; muestra();
  $("f_archivo").onchange = async e => {
    const a = e.target.files[0]; if (!a) return;
    if (a.size > 2 * 1024 * 1024) return $("f_subida").textContent = t("p_imagen_grande");
    $("f_subida").textContent = t("p_imagen_subiendo");
    try { $("f_imagen").value = await db.subirImagen(a, nuevo ? slug($("f_es").value || "producto") : p.id); $("f_subida").textContent = "✓"; muestra(); }
    catch (err) { console.error(err); $("f_subida").textContent = t("p_imagen_err"); }
  };
  const cerrar = () => velo.remove();
  $("f_cancelar").onclick = cerrar; velo.onclick = e => { if (e.target === velo) cerrar(); };
  $("f_es").focus();
  $("formProd").onsubmit = e => {
    e.preventDefault();
    const es = $("f_es").value.trim(), en = $("f_en").value.trim();
    const precio = parseFloat($("f_precio").value), antes = $("f_antes").value ? parseFloat($("f_antes").value) : null;
    if (!es) return $("f_error").textContent = t("p_err_nombre");
    if (!(precio > 0)) return $("f_error").textContent = t("p_err_precio");
    if (antes !== null && !(antes > precio)) return $("f_error").textContent = t("p_err_antes");
    const datos = { es, en: en || es, cat: $("f_cat").value, unidad: $("f_unidad").value, icono: $("f_icono").value.trim() || "🛒", imagen: $("f_imagen").value.trim() || "", precio: +precio.toFixed(2), antes: antes === null ? null : +antes.toFixed(2), activo: $("f_visible").checked, visible: $("f_visible").checked };
    if (nuevo) datos.orden = D.productos.length;
    guardar(db.guardarProducto(nuevo ? idUnico(es) : p.id, datos)); cerrar();
  };
}


/* ---------- importación masiva (CSV / texto) ---------- */
function parseCSV(txt) {
  const filas = [], sep = (txt.split("\n")[0] || "").includes(";") && !(txt.split("\n")[0] || "").includes(",") ? ";" : ",";
  for (const linea of txt.replace(/\r/g, "").split("\n")) {
    if (!linea.trim()) continue;
    const cols = []; let cur = "", q = false;
    for (let i = 0; i < linea.length; i++) {
      const ch = linea[i];
      if (ch === '"') { if (q && linea[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
      else if (ch === sep && !q) { cols.push(cur); cur = ""; }
      else cur += ch;
    }
    cols.push(cur); filas.push(cols.map(c => c.trim()));
  }
  return filas;
}
const buscarId = (lista, texto) => { const n = slug(texto); return lista.find(x => x.id === n || slug(x.es) === n || slug(x.en) === n)?.id; };
function importar() {
  const velo = document.createElement("div"); velo.className = "modal-velo";
  velo.innerHTML = `
  <div class="modal importar">
    <h2>${t("p_importar_t")}</h2>
    <p style="color:var(--tinta-2);margin-bottom:1rem">${t("p_importar_p")}</p>
    <div class="herramientas">
      <label class="btn btn-borde chico" for="csvArchivo">${t("p_importar_archivo")}</label><input type="file" id="csvArchivo" accept=".csv,text/csv,text/plain" class="sr">
      <button type="button" class="btn btn-borde chico" id="csvPlantilla">${t("p_importar_plantilla")}</button>
    </div>
    <label class="campo"><span>${t("p_importar_pegar")}</span><textarea id="csvTexto" placeholder="Palta fuerte, frutas, 8.90, kg, si, https://…"></textarea></label>
    <div class="resultado-importar" id="csvResultado"></div>
    <div class="acciones-form"><button type="button" class="btn btn-borde" id="csvCerrar">${t("p_cancelar")}</button><button type="button" class="btn btn-verde" id="csvImportar">${t("p_importar_btn")}</button></div>
  </div>`;
  document.body.appendChild(velo);
  const cerrar = () => { velo.remove(); filas(); };
  $("csvCerrar").onclick = cerrar; velo.onclick = e => { if (e.target === velo) cerrar(); };
  $("csvArchivo").onchange = e => { const f = e.target.files[0]; if (f) f.text().then(tx => { $("csvTexto").value = tx; }); };
  $("csvPlantilla").onclick = () => {
    const csv = "nombre,categoria,precio,unidad,oferta,imagen\nPalta fuerte,frutas,8.90,kg,si,https://ejemplo.com/palta.jpg\nTomate,verduras,3.80,kg,no,\nPollo entero,carnes,10.90,kg,no,";
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })); a.download = "plantilla-productos.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $("csvImportar").onclick = async () => {
    const filas = parseCSV($("csvTexto").value), ok = [], errores = [];
    let inicio = 0;
    if (filas.length && slug(filas[0][0] || "") === "nombre") inicio = 1;                       // cabecera opcional
    let orden = D.productos.length;
    filas.slice(inicio).forEach((f, i) => {
      const n = i + inicio + 1;
      if (f.length < 4) return errores.push(t("p_importar_fila", { n, m: t("p_err_columnas") }));
      const [nombreP, catTxt, precioTxt, uniTxt, ofertaTxt = "", imagen = ""] = f;
      const cat = buscarId(D.categorias, catTxt), uni = buscarId(D.unidades, uniTxt);
      const precio = parseFloat(String(precioTxt).replace(",", "."));
      if (!cat) return errores.push(t("p_importar_fila", { n, m: t("p_err_cat", { c: catTxt }) }));
      if (!uni) return errores.push(t("p_importar_fila", { n, m: t("p_err_uni", { u: uniTxt }) }));
      if (!(precio > 0)) return errores.push(t("p_importar_fila", { n, m: t("p_err_precio_fila") }));
      const oferta = /^(s[ií]|yes|y|1|true)$/i.test(ofertaTxt.trim());
      const existente = D.productos.find(p => slug(p.es) === slug(nombreP));
      ok.push({ id: existente ? existente.id : idUnico(nombreP), es: nombreP, en: existente?.en || nombreP, cat, unidad: uni, precio: +precio.toFixed(2), oferta, imagen: imagen.trim(), icono: existente?.icono || "🛒", activo: true, visible: true, orden: existente?.orden ?? orden++ });
    });
    const res = $("csvResultado");
    try { if (ok.length) await db.guardarProductos(ok); }
    catch (e) { fallo(e); return; }
    res.innerHTML = `<div class="pub-estado ${errores.length ? "local" : ""}"><i></i>${t("p_importar_res", { ok: ok.length, err: errores.length })}</div>${errores.length ? `<ul>${errores.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}`;
    if (ok.length) avisar(t("p_guardado"));
  };
}

/* ---------- categorías y unidades ---------- */
function vistaCategorias() {
  const usoCat = id => D.productos.filter(p => p.cat === id).length, usoUni = id => D.productos.filter(p => p.unidad === id).length;
  const lista = (tipo, items, uso) => items.map((c, i) => `
    <div class="item" data-tipo="${tipo}" data-i="${i}">
      <input data-campo="es" value="${esc(c.es)}" aria-label="${t("p_cat_nombre_es")}"><input data-campo="en" value="${esc(c.en)}" aria-label="${t("p_cat_nombre_en")}">
      <div class="acciones"><span class="pill">${uso(c.id)}</span><button type="button" class="mini peligro" data-borra="${i}" title="${t("p_borrar")}">${ICON.basura}</button></div>
    </div>`).join("") + `
    <form class="item nuevo" data-tipo="${tipo}"><input name="es" placeholder="${t("p_cat_nombre_es")}" required><input name="en" placeholder="${t("p_cat_nombre_en")}"><button class="btn btn-verde chico">${t("p_cat_agregar")}</button></form>`;
  $("vista").innerHTML = `
  <div class="tarjeta"><h2>${t("p_tab_categorias")}</h2><h3>${t("p_cat_nueva")}</h3><div class="lista">${lista("cat", D.categorias, usoCat)}</div></div>
  <div class="tarjeta"><h2>${t("p_unidades")}</h2><h3>${t("p_unidad_nueva")}</h3><div class="lista">${lista("uni", D.unidades, usoUni)}</div></div>`;
  const col = tipo => tipo === "cat" ? D.categorias : D.unidades;
  const persistir = () => guardar(db.guardarCatalogo({ categorias: D.categorias, unidades: D.unidades }));
  $("vista").onchange = e => { const inp = e.target.closest("[data-campo]"); if (!inp) return; const it = inp.closest(".item"); col(it.dataset.tipo)[+it.dataset.i][inp.dataset.campo] = inp.value.trim(); persistir(); };
  $("vista").onclick = e => {
    const b = e.target.closest("[data-borra]"); if (!b) return;
    const it = b.closest(".item"), tipo = it.dataset.tipo, i = +it.dataset.i, c = col(tipo)[i];
    const uso = tipo === "cat" ? usoCat(c.id) : usoUni(c.id);
    if (uso) return alert(t(tipo === "cat" ? "p_cat_en_uso" : "p_unidad_en_uso", { n: uso }));
    if (confirm(t("p_cat_confirmar", { n: c.es }))) { col(tipo).splice(i, 1); persistir(); }
  };
  $("vista").onsubmit = e => {
    e.preventDefault();
    const f = e.target, tipo = f.dataset.tipo, es = f.es.value.trim(), en = f.en.value.trim() || es;
    let id = slug(es), n = 2; while (col(tipo).some(x => x.id === id)) id = slug(es) + "-" + n++;
    col(tipo).push({ id, es, en }); persistir();
  };
}

/* ---------- tienda: datos + apariencia ---------- */
function vistaTienda() {
  const c = cfg(), dias = t("dias"), ap = { ...APARIENCIA_BASE, ...(c.apariencia || {}) };
  const horas = sel => Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${h === sel ? "selected" : ""}>${h}:00</option>`).join("");
  const opciones = (lista, sel) => lista.map(f => `<option value="${esc(f)}" ${f === sel ? "selected" : ""} class="fuente-op" style="font-family:'${esc(f)}'">${esc(f)}</option>`).join("");
  const color = (id, label, val) => `<div class="campo"><label for="${id}">${label}</label><div class="color-campo"><input type="color" id="${id}" value="${esc(val)}"><input type="text" id="${id}_hex" value="${esc(val)}" pattern="#[0-9a-fA-F]{6}" maxlength="7"></div></div>`;
  cargarFuentes([...FUENTES.titulos, ...FUENTES.texto]);
  $("vista").innerHTML = `
  <form class="tarjeta" id="formTienda">
    <h2>${t("p_tienda_datos")}</h2>
    <div class="form-grid">
      <div class="campo"><label for="c_nombre">${t("p_tienda_nombre")}</label><input id="c_nombre" value="${esc(c.nombre)}" required></div>
      <div class="campo"><label for="c_wa">${t("p_tienda_wa")}</label><input id="c_wa" inputmode="numeric" pattern="[0-9]{8,15}" value="${esc(c.whatsapp)}" required></div>
      <div class="campo"><label for="c_lema_es">${t("p_tienda_lema_es")}</label><input id="c_lema_es" value="${esc(c.lema?.es || "")}"></div>
      <div class="campo"><label for="c_lema_en">${t("p_tienda_lema_en")}</label><input id="c_lema_en" value="${esc(c.lema?.en || "")}"></div>
      <div class="campo"><label for="c_moneda">${t("p_tienda_moneda")}</label><input id="c_moneda" value="${esc(c.moneda)}" maxlength="4" required></div>
      <div class="campo"><label for="c_delivery">${t("p_tienda_delivery")}</label><input id="c_delivery" type="number" step="0.01" min="0" value="${c.delivery}" required></div>
      <div class="campo"><label for="c_yapa">${t("p_tienda_yapa")}</label><input id="c_yapa" type="number" step="0.01" min="0" value="${c.metaYapa}" required></div>
      <div class="campo"><label for="c_pagos">${t("p_tienda_pagos")}</label><input id="c_pagos" value="${esc(c.pagos)}"></div>
      <div class="campo"><label for="c_dir_es">${t("p_tienda_direccion_es")}</label><input id="c_dir_es" value="${esc(c.direccion?.es || "")}"></div>
      <div class="campo"><label for="c_dir_en">${t("p_tienda_direccion_en")}</label><input id="c_dir_en" value="${esc(c.direccion?.en || "")}"></div>
    </div>
    <h3>${t("p_tienda_horario")}</h3>
    <div class="form-grid">
      <div class="campo"><label for="c_abre">${t("p_tienda_abre")}</label><select id="c_abre">${horas(c.horaAbre)}</select></div>
      <div class="campo"><label for="c_cierra">${t("p_tienda_cierra")}</label><select id="c_cierra">${horas(c.horaCierra)}</select></div>
      <div class="campo ancho"><span>${t("p_tienda_dias")}</span><div class="dias-check">${[1, 2, 3, 4, 5, 6, 0].map(d => `<label><input type="checkbox" name="dia" value="${d}" ${(c.dias || []).includes(d) ? "checked" : ""}>${dias[d]}</label>`).join("")}</div></div>
    </div>
    <div class="acciones-form"><button class="btn btn-verde">${t("p_guardar")}</button></div>
  </form>
  <form class="tarjeta" id="formAp">
    <h2>${t("p_apariencia")}</h2>
    <p>${t("p_apariencia_p")}</p>
    <div class="form-grid">
      ${color("a_primario", t("p_color_primario"), ap.primario)}
      ${color("a_acento", t("p_color_acento"), ap.acento)}
      ${color("a_resalte", t("p_color_resalte"), ap.resalte)}
      <div class="campo"><label for="a_titulos">${t("p_fuente_titulos")}</label><select id="a_titulos">${opciones(FUENTES.titulos, ap.fuenteTitulos)}</select></div>
      <div class="campo"><label for="a_texto">${t("p_fuente_texto")}</label><select id="a_texto">${opciones(FUENTES.texto, ap.fuenteTexto)}</select></div>
    </div>
    <h3>${t("p_vista_previa")}</h3>
    <div class="preview" id="preview">
      <div class="p-top"><b id="pv_nombre">${esc(c.nombre)}</b><span>🧺 ${S(38.5)}</span></div>
      <div class="p-cuerpo"><div><h4>${t("hero_titulo")}</h4><p>${t("tienda_sub")}</p></div><i>${t("hero_cta")}</i></div>
    </div>
    <div class="acciones-form"><button type="button" class="btn btn-borde" id="btnRestaurar">${t("p_restaurar_colores")}</button><button class="btn btn-verde">${t("p_guardar")}</button></div>
  </form>`;
  /* sincronía color ↔ hex y vista previa en vivo */
  const leerAp = () => ({ primario: $("a_primario").value, acento: $("a_acento").value, resalte: $("a_resalte").value, fuenteTitulos: $("a_titulos").value, fuenteTexto: $("a_texto").value });
  const preview = () => { const a = leerAp(), s = $("preview").style; s.setProperty("--pv-verde", a.primario); s.setProperty("--pv-tomate", a.acento); s.setProperty("--pv-mango", a.resalte); s.setProperty("--pv-titulos", `"${a.fuenteTitulos}"`); s.setProperty("--pv-texto", `"${a.fuenteTexto}"`); $("pv_nombre").textContent = $("c_nombre").value || c.nombre; };
  ["a_primario", "a_acento", "a_resalte"].forEach(id => {
    $(id).oninput = () => { $(id + "_hex").value = $(id).value; preview(); };
    $(id + "_hex").oninput = () => { if (/^#[0-9a-f]{6}$/i.test($(id + "_hex").value)) { $(id).value = $(id + "_hex").value; preview(); } };
  });
  $("a_titulos").onchange = $("a_texto").onchange = $("c_nombre").oninput = preview; preview();
  $("btnRestaurar").onclick = () => { Object.entries(APARIENCIA_BASE).forEach(([k, v]) => { const m = { primario: "a_primario", acento: "a_acento", resalte: "a_resalte", fuenteTitulos: "a_titulos", fuenteTexto: "a_texto" }[k]; $(m).value = v; if ($(m + "_hex")) $(m + "_hex").value = v; }); preview(); };
  $("formAp").onsubmit = e => { e.preventDefault(); const apariencia = leerAp(); aplicarApariencia(apariencia); guardar(db.guardarConfig({ apariencia })); };
  $("formTienda").onsubmit = e => {
    e.preventDefault();
    guardar(db.guardarConfig({
      nombre: $("c_nombre").value.trim(), whatsapp: $("c_wa").value.replace(/\D/g, ""),
      lema: { es: $("c_lema_es").value.trim(), en: $("c_lema_en").value.trim() || $("c_lema_es").value.trim() },
      moneda: $("c_moneda").value.trim(), delivery: +parseFloat($("c_delivery").value || 0).toFixed(2), metaYapa: +parseFloat($("c_yapa").value || 0).toFixed(2),
      pagos: $("c_pagos").value.trim(), direccion: { es: $("c_dir_es").value.trim(), en: $("c_dir_en").value.trim() || $("c_dir_es").value.trim() },
      horaAbre: +$("c_abre").value, horaCierra: +$("c_cierra").value,
      dias: [...document.querySelectorAll('input[name="dia"]:checked')].map(x => +x.value)
    }));
  };
}

/* ---------- datos ---------- */
function vistaDatos() {
  $("vista").innerHTML = `
  <div class="tarjeta">
    <h2>${t("p_datos_t")}</h2>
    <p>${t("p_datos_p")}</p>
    <div class="pub-estado"><i></i>${t("p_datos_estado", { n: D.productos.length, c: D.categorias.length, p: pedidos.length })}</div>
    <div class="herramientas">
      <button type="button" class="btn btn-borde" id="btnExportar">${t("p_exportar")}</button>
      <label class="btn btn-borde" for="inpImportar">${t("p_importar")}</label><input type="file" id="inpImportar" accept="application/json,.json" class="sr">
      <button type="button" class="btn btn-peligro" id="btnSembrar">${t("p_sembrar")}</button>
    </div>
  </div>`;
  const paquete = () => ({ config: cfg(), categorias: D.categorias, unidades: D.unidades, productos: ordenados() });
  $("btnExportar").onclick = () => {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(paquete(), null, 2)], { type: "application/json" }));
    a.download = `mercado-copia-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $("inpImportar").onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    f.text().then(txt => {
      const d = JSON.parse(txt);
      if (!d || !Array.isArray(d.productos) || !d.config) throw 0;
      if (!confirm(t("p_importar_confirmar", { n: d.productos.length }))) return;
      return db.sembrar({ config: d.config, categorias: d.categorias || D.categorias, unidades: d.unidades || D.unidades, productos: d.productos.map(p => ({ ...p, id: p.id || slug(p.es), activo: p.activo ?? p.visible ?? true })) }).then(() => avisar(t("p_importado")));
    }).catch(err => (err === 0 || err instanceof SyntaxError) ? alert(t("p_import_err")) : fallo(err));
  };
  $("btnSembrar").onclick = () => { if (confirm(t("p_sembrar_confirmar"))) guardar(db.sembrar(SEMILLA), t("p_sembrar_ok")); };
}

/* ---------- arranque ---------- */
usuario = undefined;
montar();
db.onAuth(u => {
  usuario = u;
  if (u && !unsubPedidos) unsubPedidos = db.suscribirPedidos(l => { pedidos = l; badgePedidos(); if (tab === "pedidos" && $("listaPedidos")) vistaPedidos(); else if (tab === "datos" && $("vista")) vistaDatos(); });
  if (!u && unsubPedidos) { unsubPedidos(); unsubPedidos = null; pedidos = []; }
  montar();
});
db.suscribirTienda(s => {
  estado = s;
  if (s.listo) { D = { ...s, config: { ...SEMILLA.config, ...s.config } }; aplicarApariencia(D.config.apariencia); }
  /* refresco suave: no se vuelve a dibujar un formulario o modal abierto para no perder lo escrito */
  if (!usuario || !$("vista")) return montar();
  if (document.querySelector(".modal-velo")) return;
  if (tab === "productos") filas(); else if (tab === "categorias") vistaCategorias(); else if (tab === "datos") vistaDatos(); else if (tab === "pedidos") vistaPedidos();
});
