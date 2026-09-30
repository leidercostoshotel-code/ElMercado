/* ============================================================
   El Mercado de Amazonas · Tienda
   Toda la interfaz se construye desde aquí dentro de <div id="app">.
   Los datos llegan en tiempo real desde Firebase (db.js).
   ============================================================ */
import { t } from "./i18n.js";
import { SEMILLA } from "./data.js";
import { esc, dinero, hora, nombre, tema, idioma, carritoLocal, favicon, ICON, aplicarApariencia } from "./store.js";
import { suscribirTienda, crearPedido } from "./db.js";

favicon();

/* ---------- estado ---------- */
let D = null;                                   // { config, categorias, unidades, productos } desde Firebase
let carrito = carritoLocal.get(), cat = "todo", q = "", modo = "delivery", yapaCelebrada = false;
const lang = () => idioma.get();
const S = v => dinero(v, D.config);
const visibles = () => D.productos.filter(p => p.visible !== false);
const prod = id => D.productos.find(p => p.id === id);
const unidad = id => nombre(D.unidades.find(u => u.id === id), lang()) || id;
const categoria = id => nombre(D.categorias.find(c => c.id === id), lang()) || id;
const icono = p => p.imagen ? `<img src="${esc(p.imagen)}" alt="" loading="lazy">` : esc(p.icono || "🛒");
const reducido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = id => document.getElementById(id);

/* ---------- horario ---------- */
function estadoTienda() {
  const d = new Date(), h = d.getHours(), dia = d.getDay();
  return (D.config.dias || []).includes(dia) && h >= D.config.horaAbre && h < D.config.horaCierra;
}
function textoHorario() {
  const dias = (D.config.dias || []).slice().sort(), L = t("dias_corto");
  if (dias.join() === "1,2,3,4,5") return t("horario", { a: hora(D.config.horaAbre), c: hora(D.config.horaCierra) });
  const seguidos = dias.length > 2 && dias.every((v, i) => i === 0 || v === dias[i - 1] + 1);
  const d = seguidos ? `${L[dias[0]]}–${L[dias[dias.length - 1]]}` : dias.map(x => L[x]).join(", ");
  return t("horario_dias", { d, a: hora(D.config.horaAbre), c: hora(D.config.horaCierra) });
}

/* ---------- pantallas de carga / configuración ---------- */
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
let estado = { listo: false };
function dibujar() {
  document.documentElement.lang = lang();
  if (estado.sinFirebase) return pantalla(`${controles()}<div style="font-size:3rem">🔌</div><h1>${t("setup_t")}</h1><p>${t("setup_p")}</p><a class="btn btn-borde" href="admin.html">${t("admin")}</a>`);
  if (estado.error) return pantalla(`${controles()}<div style="font-size:3rem">⚠️</div><h1>${t("error_datos")}</h1><button type="button" class="btn btn-verde" onclick="location.reload()">↻</button>`);
  if (!estado.listo) return pantalla(`<div class="spinner"></div><p style="margin-top:1rem">${t("cargando")}</p>`);
  montar();
}

/* ---------- plantilla de la tienda ---------- */
function plantilla() {
  const c = D.config, L = lang();
  const frutas = visibles().filter(p => !p.imagen).slice(0, 8).map((p, i) => {
    const pos = [[8, 10], [52, 0], [78, 22], [22, 48], [60, 50], [5, 78], [40, 80], [80, 72]][i];
    return `<span class="fruta" style="--d:${(i * .1 + .05).toFixed(2)}s;left:${pos[0]}%;top:${pos[1]}%">${esc(p.icono)}</span>`;
  }).join("");
  return `
<header class="top">
  <div class="wrap">
    <a class="logo" href="#"><i></i>${esc(c.nombre)}<small>${esc(nombre(c.lema, L))}</small></a>
    <nav class="nav" aria-label="Principal"><a href="#tienda">${t("nav_tienda")}</a><a href="#como">${t("nav_como")}</a><a href="#yapa">${t("nav_yapa")}</a></nav>
    <div class="controles">
      <div class="lang" role="group" aria-label="${t("idioma")}"><button type="button" data-lang="es" aria-pressed="${L === "es"}">ES</button><button type="button" data-lang="en" aria-pressed="${L === "en"}">EN</button></div>
      <button type="button" class="icon-btn" id="btnTema" aria-label="${t("tema")}">${tema.get() === "dark" ? ICON.sol : ICON.luna}</button>
      <button type="button" class="cart-btn" id="btnCarrito" aria-label="${t("abrir_carrito")}">${ICON.canasta}<span id="cartTotalBtn">${S(0)}</span><span class="badge" id="cartCount">0</span></button>
    </div>
  </div>
</header>

<section class="hero" id="inicio">
  <div class="wrap">
    <div>
      <div class="estado ${estadoTienda() ? "" : "cerrado"}"><i></i><span>${estadoTienda() ? t("abierto", { h: hora(c.horaCierra) }) : t("cerrado")}</span></div>
      <h1>${t("hero_titulo")}</h1>
      <p>${t("hero_texto")}</p>
      <div class="cta"><a class="btn btn-tomate" href="#tienda">${t("hero_cta")}</a><a class="btn btn-claro" href="#como">${t("hero_cta2")}</a></div>
    </div>
    <div class="canasta" aria-hidden="true">${frutas}</div>
  </div>
  <div class="ola"></div>
</section>

<div class="wrap ofertas"><div class="marquee" aria-hidden="true"><div id="marquee1"></div><div id="marquee2"></div></div></div>

<section id="tienda">
  <div class="wrap">
    <div class="titulo"><div><h2>${t("tienda_titulo")}</h2><p>${t("tienda_sub")}</p></div><p id="contador"></p></div>
    <div class="barra">
      <label class="buscar">${ICON.lupa}<input id="buscar" type="search" placeholder="${t("buscar")}" aria-label="${t("buscar")}" value="${esc(q)}"></label>
      <div class="cats" id="cats" role="group"></div>
    </div>
    <div class="grid" id="grid"></div>
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
        <div class="barra-yapa"><i id="barraYapa"></i></div>
        <p class="texto-yapa" id="textoYapa"></p>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div><strong>${esc(c.nombre)}</strong><br>${esc(nombre(c.direccion, L))}<br>${textoHorario()}</div>
    <div>WhatsApp<br><a href="https://wa.me/${esc(c.whatsapp)}">+${esc(c.whatsapp)}</a></div>
    <div>${t("pagos")}<br>${esc(c.pagos)}</div>
    <div class="fin"><span>© ${new Date().getFullYear()} ${esc(c.nombre)} · ${t("hecho")}</span><a href="admin.html">${t("admin")}</a></div>
  </div>
</footer>

<div class="velo" id="velo"></div>
<aside class="panel" id="panel" aria-label="${t("canasta")}" aria-hidden="true">
  <div class="panel-cab"><h2>${t("canasta")}</h2><button type="button" class="cerrar" id="cerrar" aria-label="${t("cerrar")}">✕</button></div>
  <div class="lineas" id="lineas"></div>
  <div class="resumen">
    <div class="fila"><span>${t("subtotal")}</span><b id="subtotal"></b></div>
    <div class="fila"><span id="labelEnvio"></span><b id="envio"></b></div>
    <div class="fila total"><span>${t("total")}</span><span id="total"></span></div>
    <div class="entrega" role="radiogroup">
      <label><input type="radio" name="modo" value="delivery" ${modo === "delivery" ? "checked" : ""}>🛵 ${t("delivery")}</label>
      <label><input type="radio" name="modo" value="recojo" ${modo === "recojo" ? "checked" : ""}>🏪 ${t("recojo")}</label>
    </div>
    <div class="campo"><label for="nombre">${t("tu_nombre")}</label><input id="nombre" autocomplete="name" placeholder="${t("ej_nombre")}"></div>
    <div class="campo" id="campoDir"><label for="direccion">${t("direccion")}</label><input id="direccion" autocomplete="street-address" placeholder="${t("ej_direccion")}"></div>
    <button type="button" class="btn btn-wa" id="enviar" disabled>${ICON.wa}${t("confirmar")}</button>
    <p class="nota">${t("nota")}</p>
  </div>
</aside>
<div class="aviso" id="aviso" role="status"></div>`;
}

/* ---------- montaje ---------- */
function montar() {
  const nom = $("nombre")?.value, dir = $("direccion")?.value, abierto = $("panel")?.classList.contains("abierto");
  document.title = `${D.config.nombre} · ${nombre(D.config.lema, lang())}`;
  $("app").innerHTML = plantilla();
  if (nom) $("nombre").value = nom;
  if (dir) $("direccion").value = dir;
  marquesina(); categorias(); render(); actualizar(); eventos();
  if (abierto) abrir(true);
}

function marquesina() {
  const L = lang();
  const ofertas = visibles().filter(p => p.antes > p.precio).map(p => "🔥 " + t("oferta_linea", { n: nombre(p, L), p: S(p.precio), u: unidad(p.unidad), a: S(p.antes) }));
  const txt = [...ofertas, "🎁 " + t("marquee_yapa", { m: S(D.config.metaYapa) }), "🛵 " + t("marquee_delivery", { m: S(D.config.delivery) })].join("  ·  ");
  $("marquee1").textContent = txt; $("marquee2").textContent = txt;
}

function categorias() {
  const usadas = new Set(visibles().map(p => p.cat));
  const lista = [{ id: "todo", n: t("cat_todo") }, ...D.categorias.filter(c => usadas.has(c.id)).map(c => ({ id: c.id, n: nombre(c, lang()) }))];
  if (visibles().some(p => p.antes > p.precio)) lista.push({ id: "ofertas", n: t("cat_ofertas") });
  if (!lista.some(c => c.id === cat)) cat = "todo";
  $("cats").innerHTML = lista.map(c => `<button type="button" class="cat" data-cat="${c.id}" aria-pressed="${c.id === cat}">${esc(c.n)}</button>`).join("");
}

function render() {
  const L = lang();
  const lista = visibles().filter(p =>
    (cat === "todo" || (cat === "ofertas" ? p.antes > p.precio : p.cat === cat)) &&
    (!q || nombre(p, L).toLowerCase().includes(q) || nombre(p, "es").toLowerCase().includes(q) || categoria(p.cat).toLowerCase().includes(q)));
  $("contador").textContent = lista.length === 1 ? t("un_producto") : t("n_productos", { n: lista.length });
  $("grid").innerHTML = lista.length ? lista.map(p => `
    <article class="prod" data-id="${esc(p.id)}">
      ${p.antes > p.precio ? `<span class="oferta">${t("oferta")}</span>` : ""}
      <span class="icono">${icono(p)}</span>
      <h3>${esc(nombre(p, L))}</h3>
      <small>${t("por", { u: esc(unidad(p.unidad)) })}</small>
      <div class="precio">${S(p.precio)}${p.antes > p.precio ? `<s>${S(p.antes)}</s>` : ""}</div>
      ${control(p.id)}
    </article>`).join("")
    : visibles().length
      ? `<div class="vacio"><b>${t("sin_resultados", { q: esc(q) })}</b>${t("sin_resultados_sub")}</div>`
      : `<div class="vacio"><b>${t("sin_productos")}</b>${t("sin_productos_sub")}</div>`;
}

function control(id) {
  const n = carrito[id] || 0;
  return n
    ? `<div class="stepper"><button type="button" data-a="-1" data-id="${esc(id)}" aria-label="${t("quitar_uno")}">−</button><b>${n}</b><button type="button" data-a="1" data-id="${esc(id)}" aria-label="${t("agregar_uno")}">+</button></div>`
    : `<button type="button" class="add" data-a="1" data-id="${esc(id)}">${t("agregar")} <span>+</span></button>`;
}

/* ---------- carrito ---------- */
function cambiar(id, d, origen) {
  const p = prod(id); if (!p) return;
  const antes = carrito[id] || 0, n = Math.max(0, antes + d);
  if (n) carrito[id] = n; else delete carrito[id];
  carritoLocal.set(carrito);
  const card = document.querySelector(`.prod[data-id="${CSS.escape(id)}"]`);
  if (card) card.querySelector(".add,.stepper").outerHTML = control(id);
  if (d > 0 && origen && !origen.closest(".panel")) volar(origen, p);
  if (d > 0 && !antes) avisar(t("en_canasta", { n: nombre(p, lang()) }));
  actualizar();
}
const items = () => Object.entries(carrito).map(([id, n]) => ({ ...prod(id), n })).filter(p => p.id);

function actualizar() {
  const li = items(), L = lang(), c = D.config;
  const sub = li.reduce((s, p) => s + p.precio * p.n, 0);
  const env = modo === "delivery" && sub > 0 ? c.delivery : 0;
  const cnt = li.reduce((s, p) => s + p.n, 0);
  $("cartCount").textContent = cnt; $("cartTotalBtn").textContent = S(sub + env);
  $("subtotal").textContent = S(sub); $("envio").textContent = env ? S(env) : t("gratis"); $("total").textContent = S(sub + env);
  $("labelEnvio").textContent = modo === "delivery" ? t("delivery") : t("recojo");
  $("campoDir").classList.toggle("oculto", modo !== "delivery");
  $("enviar").disabled = !cnt;
  $("lineas").innerHTML = li.length ? li.map(p => `
    <div class="linea">
      <span class="icono">${icono(p)}</span>
      <div><b>${esc(nombre(p, L))}</b><small>${S(p.precio)} × ${p.n} ${esc(unidad(p.unidad))} = <b>${S(p.precio * p.n)}</b></small></div>
      <div class="stepper"><button type="button" data-a="-1" data-id="${esc(p.id)}" aria-label="${t("quitar_uno")}">−</button><b>${p.n}</b><button type="button" data-a="1" data-id="${esc(p.id)}" aria-label="${t("agregar_uno")}">+</button></div>
    </div>`).join("")
    : `<div class="vacio"><b>${t("canasta_vacia")}</b>${t("canasta_vacia_sub")} 🍅</div>`;
  const meta = c.metaYapa || 0;
  $("barraYapa").style.width = Math.min(100, meta ? sub / meta * 100 : 100) + "%";
  $("textoYapa").textContent = sub >= meta ? "🎉 " + t("yapa_lista") : t("yapa_falta", { m: S(meta - sub) });
  if (sub >= meta && sub > 0 && !yapaCelebrada) { yapaCelebrada = true; confeti(); avisar("🎁 " + t("yapa_ganaste")); }
  if (sub < meta) yapaCelebrada = false;
}

/* ---------- efectos ---------- */
function volar(desde, p) {
  if (reducido() || p.imagen) return;
  const a = desde.getBoundingClientRect(), b = $("btnCarrito").getBoundingClientRect();
  const el = document.createElement("span"); el.className = "vuela"; el.textContent = p.icono || "🛒";
  el.style.left = a.left + a.width / 2 + "px"; el.style.top = a.top + "px";
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.left = b.left + b.width / 2 + "px"; el.style.top = b.top + "px"; el.style.transform = "scale(.3)"; el.style.opacity = ".3"; });
  setTimeout(() => { el.remove(); const btn = $("btnCarrito"); if (!btn) return; btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }, 700);
}
let tAviso;
function avisar(m) { const a = $("aviso"); if (!a) return; a.textContent = m; a.classList.add("ver"); clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove("ver"), 1800); }
function confeti() {
  if (reducido()) return;
  const colores = [getComputedStyle(document.documentElement).getPropertyValue("--tomate"), getComputedStyle(document.documentElement).getPropertyValue("--mango"), "#8BC34A", getComputedStyle(document.documentElement).getPropertyValue("--verde"), "#ffffff"];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement("i"); c.className = "confeti";
    c.style.left = Math.random() * 100 + "vw"; c.style.background = colores[i % 5];
    c.style.animationDelay = Math.random() * .6 + "s"; c.style.borderRadius = i % 3 ? "2px" : "50%";
    document.body.appendChild(c); setTimeout(() => c.remove(), 2400);
  }
}
function abrir(v) {
  $("panel").classList.toggle("abierto", v); $("velo").classList.toggle("abierto", v);
  $("panel").setAttribute("aria-hidden", !v); document.body.style.overflow = v ? "hidden" : "";
}
function cambiarTema() { tema.set(tema.get() === "dark" ? "light" : "dark"); $("btnTema").innerHTML = tema.get() === "dark" ? ICON.sol : ICON.luna; }

/* ---------- pedido: se guarda en Firebase y se confirma por WhatsApp ---------- */
function enviar() {
  const li = items(); if (!li.length) return;
  const c = D.config, L = lang();
  const nom = $("nombre").value.trim(), dir = $("direccion").value.trim();
  if (!nom) { $("nombre").focus(); avisar(t("falta_nombre")); return; }
  if (modo === "delivery" && !dir) { $("direccion").focus(); avisar(t("falta_direccion")); return; }
  const sub = li.reduce((s, p) => s + p.precio * p.n, 0), env = modo === "delivery" ? c.delivery : 0, total = sub + env;
  const msg = [
    `🧺 *${t("wa_pedido", { tienda: c.nombre })}* — ${nom}`, "",
    ...li.map(p => `• ${nombre(p, L)}: ${p.n} ${unidad(p.unidad)} — ${S(p.precio * p.n)}`), "",
    `${t("subtotal")}: ${S(sub)}`,
    modo === "delivery" ? `${t("delivery")}: ${S(env)}\n📍 ${dir}` : `🏪 ${t("wa_recojo")}`,
    `*${t("total")}: ${S(total)}*`,
    sub >= c.metaYapa ? `🎁 ${t("wa_yapa")}` : "",
    "", t("wa_pago", { p: c.pagos }) + " 🙌"
  ].filter(Boolean).join("\n");
  crearPedido({
    nombre: nom, modo, direccion: modo === "delivery" ? dir : "", idioma: L,
    items: li.map(p => ({ id: p.id, nombre: p.es || nombre(p, "es"), n: p.n, unidad: p.unidad, precio: p.precio })),
    subtotal: +sub.toFixed(2), delivery: env, total: +total.toFixed(2), yapa: sub >= c.metaYapa, moneda: c.moneda
  }).catch(e => console.warn("No se pudo registrar el pedido", e));
  window.open(`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  avisar(t("pedido_guardado"));
}

/* ---------- eventos ---------- */
function eventos() {
  $("btnTema").onclick = cambiarTema;
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { if (idioma.get() !== b.dataset.lang) { idioma.set(b.dataset.lang); montar(); } });
  $("buscar").oninput = e => { q = e.target.value.trim().toLowerCase(); render(); };
  $("cats").onclick = e => { const b = e.target.closest("[data-cat]"); if (!b) return; cat = b.dataset.cat; [...$("cats").children].forEach(x => x.setAttribute("aria-pressed", x.dataset.cat === cat)); render(); };
  $("btnCarrito").onclick = () => abrir(true);
  $("cerrar").onclick = $("velo").onclick = () => abrir(false);
  $("enviar").onclick = enviar;
  document.querySelectorAll('input[name="modo"]').forEach(r => r.onchange = () => { modo = r.value; actualizar(); });
}
document.addEventListener("click", e => { const b = e.target.closest("[data-a]"); if (b) cambiar(b.dataset.id, +b.dataset.a, b); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("panel")) abrir(false); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!document.documentElement.dataset.theme && $("btnTema")) $("btnTema").innerHTML = tema.get() === "dark" ? ICON.sol : ICON.luna; });

/* ---------- arranque: Firebase en tiempo real ---------- */
dibujar();
suscribirTienda(s => {
  estado = s;
  if (s.listo) {
    D = { ...s, config: { ...SEMILLA.config, ...s.config } };      // la semilla solo rellena textos que aún no existan en Firebase
    aplicarApariencia(D.config.apariencia);
  }
  dibujar();
});
