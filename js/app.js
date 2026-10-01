/* ============================================================
   El Mercado de Amazonas · Tienda
   Toda la interfaz se construye desde aquí dentro de <div id="app">.
   Los datos llegan en tiempo real desde Firebase (db.js).
   ============================================================ */
import { t } from "./i18n.js";
import { SEMILLA } from "./data.js";
import { esc, dinero, hora, nombre, tema, idioma, carritoLocal, favicon, ICON, aplicarApariencia } from "./store.js";
import { suscribirTienda, crearPedido, ordenarProductos, esActivo } from "./db.js";

favicon();

/* ---------- estado ---------- */
let D = { config: SEMILLA.config, categorias: [], unidades: [], productos: [] };   // se reemplaza con Firebase
let estado = { cargando: true };                                                   // cargando | error | listo
let cancelar = null;
let carrito = carritoLocal.get(), cat = "todo", q = "", modo = "delivery", yapaCelebrada = false, montado = false;
let promptInstalar = null;
const lang = () => idioma.get();
const S = v => dinero(v, D.config);
const activos = () => ordenarProductos(D.productos.filter(esActivo), D.categorias);
const prod = id => D.productos.find(p => p.id === id);
const unidad = id => nombre(D.unidades.find(u => u.id === id), lang()) || id;
const categoria = id => nombre(D.categorias.find(c => c.id === id), lang()) || id;
const enOferta = p => p.oferta === true || (p.antes > p.precio);
const esKg = p => p.unidad === "kg";
const paso = p => (esKg(p) ? 0.25 : 1);
const fmtN = n => (Number.isInteger(n) ? String(n) : String(+n.toFixed(2)));
const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const reducido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = id => document.getElementById(id);
const EMOJI_CAT = { frutas: "🍎", verduras: "🥬", carnes: "🥩", abarrotes: "🛒" };

/* ---------- imagen de producto: lazy, tamaño fijo, alt descriptivo y fallback a emoji ---------- */
function icono(p, tam = 68) {
  const emoji = esc(p.icono || EMOJI_CAT[p.cat] || "🛒");
  if (!p.imagen) return `<span class="emoji" aria-hidden="true">${emoji}</span>`;
  const alt = esc(t("img_alt", { n: nombre(p, lang()), c: categoria(p.cat) }));
  return `<img src="${esc(p.imagen)}" alt="${alt}" width="${tam}" height="${tam}" loading="lazy" decoding="async" onload="this.parentElement.classList.add('ok')" onerror="this.parentElement.classList.add('fallo');this.remove()"><span class="emoji" aria-hidden="true">${emoji}</span>`;
}

/* ---------- horario con hora real de Lima ---------- */
function ahoraLima() {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: "America/Lima", hour: "numeric", minute: "numeric", weekday: "short", hour12: false });
  const p = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { dia: dias[p.weekday], h: Number(p.hour) % 24 + Number(p.minute) / 60 };
}
function estadoTienda() {
  const c = D.config, { dia, h } = ahoraLima(), dias = c.dias || [];
  const limite = c.horaLimite ?? c.horaCierra;
  if (dias.includes(dia) && h >= c.horaAbre && h < limite) return { abierto: true, texto: t("abierto", { h: hora(limite) }) };
  if (dias.includes(dia) && h < c.horaAbre) return { abierto: false, texto: t("cerrado_hoy", { h: hora(c.horaAbre) }) };
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (dias.includes(d)) return { abierto: false, texto: i === 1 ? t("cerrado_manana", { h: hora(c.horaAbre) }) : t("cerrado_dia", { d: t("dias")[d], h: hora(c.horaAbre) }) };
  }
  return { abierto: false, texto: t("cerrado") };
}
function textoHorario() {
  const dias = (D.config.dias || []).slice().sort(), L = t("dias_corto");
  if (dias.join() === "1,2,3,4,5") return t("horario", { a: hora(D.config.horaAbre), c: hora(D.config.horaCierra) });
  const seguidos = dias.length > 2 && dias.every((v, i) => i === 0 || v === dias[i - 1] + 1);
  const d = seguidos ? `${L[dias[0]]}–${L[dias[dias.length - 1]]}` : dias.map(x => L[x]).join(", ");
  return t("horario_dias", { d, a: hora(D.config.horaAbre), c: hora(D.config.horaCierra) });
}

/* ---------- pantallas especiales ---------- */
const controles = () => `
  <div class="controles">
    <div class="lang" role="group" aria-label="${t("idioma")}"><button type="button" data-lang="es" aria-pressed="${lang() === "es"}">ES</button><button type="button" data-lang="en" aria-pressed="${lang() === "en"}">EN</button></div>
    <button type="button" class="icon-btn" id="btnTema" aria-label="${t("tema")}">${tema.get() === "dark" ? ICON.sol : ICON.luna}</button>
  </div>`;
function pantalla(html) {
  $("app").innerHTML = `<div class="pantalla"><div class="caja">${html}</div></div>`;
  $("btnTema")?.addEventListener("click", cambiarTema);
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { idioma.set(b.dataset.lang); dibujar(); });
}
function dibujar() {
  document.documentElement.lang = lang();
  if (estado.sinFirebase) return pantalla(`${controles()}<div style="font-size:3rem">🔌</div><h1>${t("setup_t")}</h1><p>${t("setup_p")}</p><a class="btn btn-borde" href="admin.html">${t("admin")}</a>`);
  montar();
}

/* ---------- plantilla de la tienda ---------- */
function plantilla() {
  const c = D.config, L = lang(), est = estadoTienda();
  const frutas = "🍅🥑🍋🥩🥕🍍🌽🍚".split(/(?:)/u).map((e, i) => `<span class="fruta" style="--d:${(i * .1 + .05).toFixed(2)}s;left:${[8, 52, 78, 22, 60, 5, 40, 80][i]}%;top:${[10, 0, 22, 48, 50, 78, 80, 72][i]}%">${e}</span>`).join("");
  const fotos = (c.portada || []).filter(f => f && f.url).slice(0, 12);
  /* srcset nítido para pantallas retina; las URLs de Unsplash aceptan parámetros, otras se usan tal cual */
  const src = (u, w) => /images\.unsplash\.com/.test(u) ? `${u.split("?")[0]}?w=${w}&q=82&auto=format&fit=crop` : u;
  /* con fotos: ocupan todo el fondo del hero y el texto queda delante; sin fotos: la canasta de emojis a la derecha */
  const pasarela = fotos.length ? `<div class="pasarela" id="pasarela" aria-hidden="true">${fotos.map((f, i) => `<img src="${esc(src(f.url, 1600))}" srcset="${esc(src(f.url, 900))} 900w, ${esc(src(f.url, 1600))} 1600w, ${esc(src(f.url, 2400))} 2400w" sizes="100vw" alt="${esc(nombre(f, L))}" width="1600" height="900" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" draggable="false">`).join("")}<div class="canasta respaldo">${frutas}</div><div class="velo-hero"></div></div>` : "";
  return `
<a class="saltar" href="#tienda">${t("nav_tienda")}</a>
<header class="top">
  <div class="wrap">
    <a class="logo" href="#"><i></i>${esc(c.nombre)}<small>${esc(nombre(c.lema, L))}</small></a>
    <nav class="nav" aria-label="Principal"><a href="#tienda">${t("nav_tienda")}</a><a href="#como">${t("nav_como")}</a><a href="#yapa">${t("nav_yapa")}</a></nav>
    <div class="controles">
      <div class="lang" role="group" aria-label="${t("idioma")}"><button type="button" data-lang="es" aria-pressed="${L === "es"}">ES</button><button type="button" data-lang="en" aria-pressed="${L === "en"}">EN</button></div>
      <button type="button" class="icon-btn" id="btnTema" aria-label="${t("tema")}">${tema.get() === "dark" ? ICON.sol : ICON.luna}</button>
      <button type="button" class="cart-btn" id="btnCarrito" aria-haspopup="dialog" aria-controls="panel"><span class="sr">${t("abrir_carrito")}: </span>${ICON.canasta}<span id="cartTotalBtn">${S(0)}</span><span class="badge" id="cartCount" aria-live="polite" aria-atomic="true">0</span></button>
    </div>
  </div>
</header>

<main id="contenido">
<section class="hero ${fotos.length ? "con-fotos" : ""}" id="inicio">
  ${pasarela}
  <div class="wrap">
    <div>
      <div class="estado ${est.abierto ? "" : "cerrado"}"><i></i><span id="estadoTexto">${est.texto}</span></div>
      <h1>${t("hero_titulo")}</h1>
      <p>${t("hero_texto")}</p>
      <div class="cta"><a class="btn btn-tomate" href="#tienda">${t("hero_cta")}</a><a class="btn btn-claro" href="#como">${t("hero_cta2")}</a></div>
    </div>
    ${fotos.length ? "" : `<div class="canasta" aria-hidden="true">${frutas}</div>`}
  </div>
  <div class="ola"></div>
</section>

<div class="wrap ofertas"><div class="marquee" aria-hidden="true"><div id="marquee1"></div><div id="marquee2"></div></div></div>

<section id="tienda" aria-labelledby="tituloTienda">
  <div class="wrap">
    <div id="ofertasHoy"></div>
    <div class="titulo"><div><h2 id="tituloTienda">${t("tienda_titulo")}</h2><p>${t("tienda_sub")}</p></div><p id="contador" aria-live="polite"></p></div>
    <div class="barra">
      <label class="buscar">${ICON.lupa}<input id="buscar" type="search" placeholder="${t("buscar")}" aria-label="${t("buscar")}" value="${esc(q)}" autocomplete="off"></label>
      <div class="cats" id="cats" role="group" aria-label="${t("nav_tienda")}"></div>
    </div>
    <div class="grid" id="grid" aria-busy="true"></div>
  </div>
</section>

<section id="como">
  <div class="wrap">
    <div class="titulo"><h2>${t("como_titulo")}</h2></div>
    <div class="pasos">
      <div class="paso"><h3>${t("paso1_t")}</h3><p>${t("paso1_p")}</p></div>
      <div class="paso"><h3>${t("paso2_t")}</h3><p>${t("paso2_p")}</p></div>
      <div class="paso"><h3>${t("paso3_t")}</h3><p>${t("paso3_p")}</p></div>
    </div>
  </div>
</section>

<section id="yapa">
  <div class="wrap">
    <div class="yapa">
      <div class="icono" aria-hidden="true">🎁</div>
      <div>
        <h2>${t("yapa_titulo", { m: S(c.metaYapa) })}</h2>
        <p>${t("yapa_texto")}</p>
        <div class="barra-yapa" role="progressbar" aria-label="${t("nav_yapa")}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="progYapa"><i id="barraYapa"></i></div>
        <p class="texto-yapa" id="textoYapa"></p>
      </div>
    </div>
  </div>
</section>
</main>

<footer>
  <div class="wrap">
    <div><strong>${esc(c.nombre)}</strong><br>${esc(nombre(c.direccion, L))}<br>${textoHorario()}</div>
    <div>WhatsApp<br><a href="https://wa.me/${esc(c.whatsapp)}" rel="noopener">+${esc(c.whatsapp)}</a></div>
    <div>${t("pagos")}<br>${esc(c.pagos)}</div>
    <div class="fin"><span>© ${new Date().getFullYear()} ${esc(c.nombre)} · ${t("hecho")}</span><a href="admin.html">${t("admin")}</a></div>
  </div>
</footer>

<a class="wa-flotante" id="waFlotante" href="https://wa.me/${esc(c.whatsapp)}?text=${encodeURIComponent(t("wa_consulta") + " " + c.nombre)}" target="_blank" rel="noopener" aria-label="${t("wa_flotante")}" title="${t("wa_flotante")}">${ICON.wa}</a>

<div class="instalar" id="instalar" hidden>
  <div><b>${t("instalar_t")}</b><small>${t("instalar_p")}</small></div>
  <button type="button" class="btn btn-verde chico" id="btnInstalar">${t("instalar")}</button>
  <button type="button" class="icon-btn" id="btnNoInstalar" aria-label="${t("ahora_no")}">✕</button>
</div>

<div class="velo" id="velo"></div>
<aside class="panel" id="panel" role="dialog" aria-modal="true" aria-labelledby="tituloPanel" inert tabindex="-1">
  <div class="panel-cab"><h2 id="tituloPanel">${t("canasta")}</h2><button type="button" class="cerrar" id="cerrar" aria-label="${t("cerrar")}">✕</button></div>
  <div class="lineas" id="lineas"></div>
  <form class="resumen" id="formPedido" novalidate>
    <div class="fila"><span>${t("subtotal")}</span><b id="subtotal"></b></div>
    <div class="fila"><span id="labelEnvio"></span><b id="envio"></b></div>
    <div class="fila total"><span>${t("total")}</span><span id="total"></span></div>
    <div class="entrega" role="radiogroup" aria-label="${t("wa_modalidad")}">
      <label><input type="radio" name="modo" value="delivery" ${modo === "delivery" ? "checked" : ""}>🛵 ${t("delivery")}</label>
      <label><input type="radio" name="modo" value="recojo" ${modo === "recojo" ? "checked" : ""}>🏪 ${t("recojo")}</label>
    </div>
    <div class="campo"><label for="nombre">${t("tu_nombre")}</label><input id="nombre" autocomplete="name" placeholder="${t("ej_nombre")}" aria-describedby="errNombre" minlength="2"><small class="error-campo" id="errNombre" aria-live="polite"></small></div>
    <div class="campo" id="campoDir"><label for="direccion">${t("direccion")}</label><input id="direccion" autocomplete="street-address" placeholder="${t("ej_direccion")}" aria-describedby="errDireccion"><small class="error-campo" id="errDireccion" aria-live="polite"></small></div>
    <button type="submit" class="btn btn-wa" id="enviar" aria-describedby="ayudaEnviar">${ICON.wa}${t("confirmar")}</button>
    <p class="ayuda" id="ayudaEnviar" aria-live="polite"></p>
    <p class="nota">${t("nota")}</p>
  </form>
</aside>
<div class="aviso" id="aviso" role="status" aria-live="polite"></div>`;
}

/* ---------- pasarela de fotos del hero: fundido cruzado + zoom lento ---------- */
let tPasarela = null;
function iniciarPasarela() {
  clearInterval(tPasarela);
  const cont = $("pasarela"); if (!cont) return;
  const fotos = [...cont.querySelectorAll("img")];
  let listas = [], activa = -1;
  const mostrar = () => {
    if (!listas.length) return;
    activa = (activa + 1) % listas.length;
    listas.forEach((img, i) => img.classList.toggle("activa", i === activa));
    const sig = listas[(activa + 1) % listas.length]; if (sig) sig.loading = "eager";
  };
  const arrancar = () => { if (tPasarela) return; cont.classList.add("lista"); mostrar(); tPasarela = setInterval(mostrar, reducido() ? 7000 : 5500); };
  fotos.forEach(img => {
    const ok = () => { if (!img.naturalWidth) return fallo(); listas.push(img); if (listas.length === 1) arrancar(); };
    const fallo = () => { img.remove(); if (!cont.querySelector("img")) cont.classList.add("sin-fotos"); };
    if (img.complete) (img.naturalWidth ? ok : fallo)(); else { img.onload = ok; img.onerror = fallo; }
  });
  setTimeout(() => { if (!listas.length) cont.classList.add("sin-fotos"); }, 6000);        // si ninguna foto responde, queda la canasta de emojis
}

/* ---------- montaje ---------- */
function montar() {
  const nom = $("nombre")?.value, dir = $("direccion")?.value, abierto = $("panel")?.classList.contains("abierto"), foco = document.activeElement?.id;
  document.title = `${D.config.nombre} · ${nombre(D.config.lema, lang())}`;
  $("app").innerHTML = plantilla();
  if (nom) $("nombre").value = nom;
  if (dir) $("direccion").value = dir;
  marquesina(); categorias(); ofertasHoy(); render(); actualizar(); eventos(); iniciarPasarela();
  if (abierto) abrir(true);
  if (foco === "buscar") { const b = $("buscar"); b.focus(); b.setSelectionRange(b.value.length, b.value.length); }
  montado = true;
  if (promptInstalar) mostrarInstalar();
}

function marquesina() {
  const L = lang();
  const ofertas = activos().filter(p => p.antes > p.precio).map(p => "🔥 " + t("oferta_linea", { n: nombre(p, L), p: S(p.precio), u: unidad(p.unidad), a: S(p.antes) }));
  const txt = [...ofertas, "🎁 " + t("marquee_yapa", { m: S(D.config.metaYapa) }), "🛵 " + t("marquee_delivery", { m: S(D.config.delivery) })].join("  ·  ");
  $("marquee1").textContent = txt; $("marquee2").textContent = txt;
}

function categorias() {
  const lista = activos(), conteo = {};
  lista.forEach(p => { conteo[p.cat] = (conteo[p.cat] || 0) + 1; });
  const chips = [{ id: "todo", n: t("cat_todo"), c: lista.length }, ...D.categorias.filter(c => conteo[c.id]).map(c => ({ id: c.id, n: nombre(c, lang()), c: conteo[c.id] }))];
  const of = lista.filter(enOferta).length; if (of) chips.push({ id: "ofertas", n: t("cat_ofertas"), c: of });
  if (!chips.some(c => c.id === cat)) cat = "todo";
  $("cats").innerHTML = chips.map(c => `<button type="button" class="cat" data-cat="${c.id}" aria-pressed="${c.id === cat}">${esc(c.n)}<span class="num">${c.c}</span></button>`).join("");
}

function ofertasHoy() {
  const L = lang(), lista = activos().filter(enOferta);
  const el = $("ofertasHoy");
  if (!lista.length || estado.cargando) { el.innerHTML = ""; return; }
  el.innerHTML = `
    <div class="titulo titulo-ofertas"><div><h2>🔥 ${t("ofertas_hoy")}</h2><p>${t("ofertas_sub")}</p></div><button type="button" class="btn btn-borde chico" data-cat-link="ofertas">${t("ver_todo")}</button></div>
    <div class="tira" role="list">${lista.slice(0, 10).map(p => `
      <article class="prod chica" role="listitem" data-id="${esc(p.id)}">
        <span class="oferta">${t("oferta")}</span>
        <span class="icono">${icono(p, 56)}</span>
        <h3>${esc(nombre(p, L))}</h3>
        <div class="precio">${S(p.precio)}${p.antes > p.precio ? `<s>${S(p.antes)}</s>` : ""}</div>
        ${control(p)}
      </article>`).join("")}</div>`;
}

function render() {
  const L = lang(), grid = $("grid"), lista = activos();
  grid.setAttribute("aria-busy", estado.cargando ? "true" : "false");
  if (estado.error) {
    $("contador").textContent = "";
    grid.innerHTML = `<div class="vacio error"><span aria-hidden="true">📡</span><b>${t("grid_error")}</b>${t("grid_error_sub")}<br><button type="button" class="btn btn-verde chico" id="btnReintentar">↻ ${t("reintentar")}</button></div>`;
    $("btnReintentar").onclick = reintentar; return;
  }
  if (estado.cargando) {
    $("contador").textContent = t("cargando");
    grid.innerHTML = Array.from({ length: 8 }, () => `<div class="prod skeleton" aria-hidden="true"><span class="icono"></span><b></b><small></small><div class="precio"></div><div class="add"></div></div>`).join("");
    return;
  }
  const nq = norm(q);
  const filtrada = lista.filter(p =>
    (cat === "todo" || (cat === "ofertas" ? enOferta(p) : p.cat === cat)) &&
    (!nq || norm(nombre(p, L)).includes(nq) || norm(nombre(p, "es")).includes(nq) || norm(nombre(p, "en")).includes(nq) || norm(categoria(p.cat)).includes(nq)));
  $("contador").textContent = filtrada.length === 1 ? t("un_producto") : t("n_productos", { n: filtrada.length });
  grid.innerHTML = filtrada.length ? filtrada.map(p => `
    <article class="prod" data-id="${esc(p.id)}">
      ${enOferta(p) ? `<span class="oferta">${t("oferta")}</span>` : ""}
      <span class="icono">${icono(p)}</span>
      <h3>${esc(nombre(p, L))}</h3>
      <small>${t("por", { u: esc(unidad(p.unidad)) })}</small>
      <div class="precio">${S(p.precio)}${p.antes > p.precio ? `<s>${S(p.antes)}</s>` : ""}</div>
      ${control(p)}
    </article>`).join("")
    : lista.length
      ? `<div class="vacio"><b>${t("sin_resultados", { q: esc(q) })}</b>${t("sin_resultados_sub")}</div>`
      : `<div class="vacio"><b>${t("sin_productos")}</b>${t("sin_productos_sub")}</div>`;
}

function control(p) {
  const n = carrito[p.id] || 0, id = esc(p.id), st = paso(p);
  return n
    ? `<div class="stepper" role="group" aria-label="${t("cantidad")}"><button type="button" data-a="${-st}" data-id="${id}" aria-label="${t("quitar_uno")}">−</button><b aria-live="polite">${fmtN(n)}${esKg(p) ? " kg" : ""}</b><button type="button" data-a="${st}" data-id="${id}" aria-label="${t("agregar_uno")}">+</button></div>`
    : `<button type="button" class="add" data-a="1" data-id="${id}">${t("agregar")} <span aria-hidden="true">+</span></button>`;
}

/* ---------- carrito ---------- */
function cambiar(id, d, origen) {
  const p = prod(id); if (!p) return;
  const antes = carrito[id] || 0, n = Math.max(0, +(antes + d).toFixed(2));
  if (n) carrito[id] = n; else delete carrito[id];
  carritoLocal.set(carrito);
  document.querySelectorAll(`.prod[data-id="${CSS.escape(id)}"]`).forEach(card => { card.querySelector(".add,.stepper").outerHTML = control(p); });
  if (d > 0 && origen && !origen.closest(".panel")) volar(origen, p);
  if (d > 0 && !antes) avisar("🧺 " + t("agregado"));
  actualizar();
}
const items = () => Object.entries(carrito).map(([id, n]) => ({ ...prod(id), n })).filter(p => p.id);

function actualizar() {
  const li = items(), L = lang(), c = D.config;
  const sub = li.reduce((s, p) => s + p.precio * p.n, 0);
  const env = modo === "delivery" && sub > 0 ? c.delivery : 0;
  const cnt = estado.cargando || estado.error ? Object.keys(carrito).length : li.length;   // mientras carga, cuenta lo guardado
  const badge = $("cartCount");
  if (badge.textContent !== String(cnt)) { badge.classList.remove("late"); void badge.offsetWidth; badge.classList.add("late"); }
  badge.textContent = cnt; $("cartTotalBtn").textContent = S(sub + env);
  $("subtotal").textContent = S(sub); $("envio").textContent = env ? S(env) : t("gratis"); $("total").textContent = S(sub + env);
  $("labelEnvio").textContent = modo === "delivery" ? t("delivery") : t("recojo");
  $("campoDir").classList.toggle("oculto", modo !== "delivery");
  $("lineas").innerHTML = li.length ? li.map(p => `
    <div class="linea">
      <span class="icono">${icono(p, 40)}</span>
      <div><b>${esc(nombre(p, L))}</b><small>${S(p.precio)} × ${fmtN(p.n)} ${esc(unidad(p.unidad))} = <b>${S(p.precio * p.n)}</b></small></div>
      <div class="stepper" role="group" aria-label="${t("cantidad")}"><button type="button" data-a="${-paso(p)}" data-id="${esc(p.id)}" aria-label="${t("quitar_uno")}">−</button><b>${fmtN(p.n)}</b><button type="button" data-a="${paso(p)}" data-id="${esc(p.id)}" aria-label="${t("agregar_uno")}">+</button></div>
    </div>`).join("")
    : `<div class="vacio"><b>${t("canasta_vacia")}</b><a href="#tienda" id="irTienda">${t("ir_tienda")} 🍅</a></div>`;
  $("irTienda")?.addEventListener("click", () => abrir(false));
  const meta = c.metaYapa || 0, pct = Math.min(100, meta ? sub / meta * 100 : 100);
  $("barraYapa").style.width = pct + "%"; $("progYapa").setAttribute("aria-valuenow", Math.round(pct));
  $("textoYapa").textContent = sub >= meta ? "🎉 " + t("yapa_lista") : t("yapa_falta", { m: S(meta - sub) });
  if (sub >= meta && sub > 0 && !yapaCelebrada) { yapaCelebrada = true; confeti(); avisar("🎁 " + t("yapa_ganaste")); }
  if (sub < meta) yapaCelebrada = false;
  ayuda(false);
}

/* Qué falta para poder confirmar; con `mostrar` marca también los campos */
function ayuda(mostrar) {
  const li = items(), nom = ($("nombre").value || "").trim(), dir = ($("direccion").value || "").trim();
  const faltan = [];
  if (!li.length) faltan.push(t("ayuda_vacia"));
  if (nom.length < 2) faltan.push(t("ayuda_nombre"));
  if (modo === "delivery" && !dir) faltan.push(t("ayuda_direccion"));
  $("ayudaEnviar").textContent = faltan.length ? faltan.join(" ") : t("ayuda_lista");
  $("ayudaEnviar").classList.toggle("lista", !faltan.length);
  $("enviar").classList.toggle("incompleto", !!faltan.length);
  $("enviar").setAttribute("aria-disabled", faltan.length ? "true" : "false");
  if (mostrar) {
    $("errNombre").textContent = nom.length < 2 ? t("err_nombre_corto") : "";
    $("errDireccion").textContent = modo === "delivery" && !dir ? t("err_direccion") : "";
    $("nombre").setAttribute("aria-invalid", nom.length < 2);
    $("direccion").setAttribute("aria-invalid", modo === "delivery" && !dir);
  }
  return !faltan.length;
}

/* ---------- efectos ---------- */
function volar(desde, p) {
  if (reducido() || p.imagen) return;
  const a = desde.getBoundingClientRect(), b = $("btnCarrito").getBoundingClientRect();
  const el = document.createElement("span"); el.className = "vuela"; el.textContent = p.icono || EMOJI_CAT[p.cat] || "🛒";
  el.style.left = a.left + a.width / 2 + "px"; el.style.top = a.top + "px";
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.left = b.left + b.width / 2 + "px"; el.style.top = b.top + "px"; el.style.transform = "scale(.3)"; el.style.opacity = ".3"; });
  setTimeout(() => { el.remove(); const btn = $("btnCarrito"); if (!btn) return; btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }, 700);
}
let tAviso;
function avisar(m) { const a = $("aviso"); if (!a) return; a.textContent = m; a.classList.add("ver"); clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove("ver"), 1800); }
function confeti() {
  if (reducido()) return;
  const cs = getComputedStyle(document.documentElement), colores = [cs.getPropertyValue("--tomate"), cs.getPropertyValue("--mango"), "#8BC34A", cs.getPropertyValue("--verde"), "#ffffff"];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement("i"); c.className = "confeti";
    c.style.left = Math.random() * 100 + "vw"; c.style.background = colores[i % 5];
    c.style.animationDelay = Math.random() * .6 + "s"; c.style.borderRadius = i % 3 ? "2px" : "50%";
    document.body.appendChild(c); setTimeout(() => c.remove(), 2400);
  }
}

/* Panel lateral: abre/cierra, bloquea el fondo y atrapa el foco */
let ultimoFoco = null;
function abrir(v) {
  const panel = $("panel");
  panel.classList.toggle("abierto", v); $("velo").classList.toggle("abierto", v);
  if (v) panel.removeAttribute("inert"); else panel.setAttribute("inert", ""); document.body.style.overflow = v ? "hidden" : "";
  document.querySelectorAll("#app > :not(.panel):not(.velo)").forEach(el => v ? el.setAttribute("inert", "") : el.removeAttribute("inert"));
  if (v) { ultimoFoco = document.activeElement; setTimeout(() => $("cerrar").focus(), 50); }
  else if (ultimoFoco?.isConnected) ultimoFoco.focus();
}
function atraparFoco(e) {
  const panel = $("panel"); if (!panel?.classList.contains("abierto") || e.key !== "Tab") return;
  const f = [...panel.querySelectorAll("button, input, a[href], [tabindex]:not([tabindex='-1'])")].filter(x => !x.disabled && x.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function cambiarTema() { tema.set(tema.get() === "dark" ? "light" : "dark"); $("btnTema").innerHTML = tema.get() === "dark" ? ICON.sol : ICON.luna; }

/* ---------- pedido: se guarda en Firebase y se confirma por WhatsApp ---------- */
function enviar(e) {
  e?.preventDefault();
  if (!ayuda(true)) { ($("nombre").value.trim().length < 2 ? $("nombre") : $("direccion")).focus(); return; }
  const li = items(), c = D.config, L = lang();
  const nom = $("nombre").value.trim(), dir = $("direccion").value.trim();
  const sub = li.reduce((s, p) => s + p.precio * p.n, 0), env = modo === "delivery" ? c.delivery : 0, total = sub + env;
  const msg = [
    `🧺 *${t("wa_pedido", { tienda: c.nombre })}*`, "",
    ...li.map(p => `• ${nombre(p, L)} — ${fmtN(p.n)} ${unidad(p.unidad)} × ${S(p.precio)} = *${S(p.precio * p.n)}*`), "",
    `${t("subtotal")}: ${S(sub)}`,
    modo === "delivery" ? `${t("delivery")}: ${S(env)}` : "",
    `*${t("total")}: ${S(total)}*`,
    sub >= c.metaYapa ? `🎁 ${t("wa_yapa")}` : "", "",
    `${t("wa_modalidad")}: ${modo === "delivery" ? "🛵 " + t("delivery") : "🏪 " + t("wa_recojo")}`,
    `${t("wa_nombre")}: ${nom}`,
    modo === "delivery" ? `${t("wa_direccion")}: ${dir}` : "", "",
    t("wa_nota"),
    t("wa_pago", { p: c.pagos }) + " 🙌"
  ].filter(x => x !== "").join("\n");
  crearPedido({
    nombre: nom, modo, direccion: modo === "delivery" ? dir : "", idioma: L,
    items: li.map(p => ({ id: p.id, nombre: p.es || nombre(p, "es"), n: p.n, unidad: p.unidad, precio: p.precio })),
    subtotal: +sub.toFixed(2), delivery: env, total: +total.toFixed(2), yapa: sub >= c.metaYapa, moneda: c.moneda
  }).catch(err => console.warn("[Firestore] No se pudo registrar el pedido:", err?.code || err));
  window.open(`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  avisar(t("pedido_guardado"));
}

/* ---------- PWA: instalación ---------- */
function mostrarInstalar() {
  const b = $("instalar"); if (!b || !promptInstalar) return;
  try { if (localStorage.getItem("leitime_no_instalar")) return; } catch {}
  b.hidden = false;
  $("btnInstalar").onclick = async () => { b.hidden = true; promptInstalar.prompt(); await promptInstalar.userChoice.catch(() => {}); promptInstalar = null; };
  $("btnNoInstalar").onclick = () => { b.hidden = true; try { localStorage.setItem("leitime_no_instalar", "1"); } catch {} };
}
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); promptInstalar = e; if (montado) mostrarInstalar(); });
if ("serviceWorker" in navigator && location.protocol === "https:") window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(e => console.warn("[SW]", e)));

/* ---------- eventos ---------- */
function eventos() {
  $("btnTema").onclick = cambiarTema;
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { if (idioma.get() !== b.dataset.lang) { idioma.set(b.dataset.lang); montar(); } });
  $("buscar").oninput = e => { q = e.target.value.trim(); render(); };
  $("cats").onclick = e => { const b = e.target.closest("[data-cat]"); if (!b) return; cat = b.dataset.cat; [...$("cats").children].forEach(x => x.setAttribute("aria-pressed", x.dataset.cat === cat)); render(); };
  $("ofertasHoy").onclick = e => { const b = e.target.closest("[data-cat-link]"); if (!b) return; cat = b.dataset.catLink; [...$("cats").children].forEach(x => x.setAttribute("aria-pressed", x.dataset.cat === cat)); render(); $("grid").scrollIntoView({ behavior: reducido() ? "auto" : "smooth", block: "start" }); };
  $("btnCarrito").onclick = () => abrir(true);
  $("cerrar").onclick = $("velo").onclick = () => abrir(false);
  $("formPedido").onsubmit = enviar;
  $("nombre").oninput = $("direccion").oninput = () => { $("errNombre").textContent = ""; $("errDireccion").textContent = ""; ayuda(false); };
  document.querySelectorAll('input[name="modo"]').forEach(r => r.onchange = () => { modo = r.value; actualizar(); });
}
document.addEventListener("click", e => { const b = e.target.closest("[data-a]"); if (b) cambiar(b.dataset.id, +b.dataset.a, b); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("panel")?.classList.contains("abierto")) abrir(false); atraparFoco(e); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!document.documentElement.dataset.theme && $("btnTema")) $("btnTema").innerHTML = tema.get() === "dark" ? ICON.sol : ICON.luna; });
setInterval(() => { const el = $("estadoTexto"); if (!el) return; const est = estadoTienda(); el.textContent = est.texto; el.closest(".estado").classList.toggle("cerrado", !est.abierto); }, 60000);

/* ---------- arranque: Firebase en tiempo real ---------- */
function recibir(s) {
  if (s.sinFirebase) { estado = s; return dibujar(); }
  const config = { ...SEMILLA.config, ...s.config };
  const cambioConfig = JSON.stringify(config) !== JSON.stringify(D.config) || s.categorias.length !== D.categorias.length;
  D = { config, categorias: s.categorias, unidades: s.unidades, productos: s.productos };
  estado = { cargando: !!s.cargando && !s.error, error: s.error || null, listo: true };
  aplicarApariencia(config.apariencia);
  if (!montado || cambioConfig) return dibujar();
  categorias(); ofertasHoy(); render(); marquesina(); actualizar();
}
function reintentar() { if (cancelar) cancelar(); estado = { cargando: true }; render(); cancelar = suscribirTienda(recibir); }
dibujar();
cancelar = suscribirTienda(recibir);
