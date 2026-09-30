/* ============================================================
   LEITIME · Tienda
   Toda la interfaz se construye desde aquí dentro de <div id="app">.
   ============================================================ */
(() => {
  const { esc, dinero, hora, nombre, tema, idioma } = Store;
  const ICON = {
    sol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    luna: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    canasta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M3 10h18l-1.6 9a2 2 0 0 1-2 1.6H6.6a2 2 0 0 1-2-1.6L3 10z"/><path d="m7 10 3-6M17 10l-3-6M9 14v3M15 14v3"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 5.2 5.2 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>'
  };

  /* favicon generado desde JS para no tocar el HTML */
  const fav = document.createElement("link"); fav.rel = "icon";
  fav.href = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#146B3A"/><path d="M32 14c10 0 18 8 18 18 0 12-8 18-18 18S14 44 14 32c0-10 8-18 18-18z" fill="#E2432B"/><path d="M32 12c4-4 8-4 10-2-2 2-4 4-10 6-2-4-4-4-6-4 2-2 4-2 6 0z" fill="#8BC34A"/></svg>');
  document.head.appendChild(fav);

  /* ---------- estado ---------- */
  let D = Store.load();
  let carrito = {}, cat = "todo", q = "", modo = "delivery", yapaCelebrada = false;
  try { carrito = JSON.parse(localStorage.getItem("leitime_carrito") || "{}"); } catch {}
  const guardarCarrito = () => { try { localStorage.setItem("leitime_carrito", JSON.stringify(carrito)); } catch {} };
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
    const dias = D.config.dias || [];
    return dias.includes(dia) && h >= D.config.horaAbre && h < D.config.horaCierra;
  }
  function textoHorario() {
    const dias = (D.config.dias || []).slice().sort();
    const L = t("dias_corto");
    let d;
    if (dias.length === 5 && dias.join() === "1,2,3,4,5") return t("horario", { a: hora(D.config.horaAbre), c: hora(D.config.horaCierra) });
    if (dias.length > 2 && dias.every((v, i) => i === 0 || v === dias[i - 1] + 1)) d = `${L[dias[0]]}–${L[dias[dias.length - 1]]}`;
    else d = dias.map(x => L[x]).join(", ");
    return t("horario_dias", { d, a: hora(D.config.horaAbre), c: hora(D.config.horaCierra) });
  }

  /* ---------- plantilla ---------- */
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
    <nav class="nav" aria-label="Principal">
      <a href="#tienda">${t("nav_tienda")}</a><a href="#como">${t("nav_como")}</a><a href="#yapa">${t("nav_yapa")}</a>
    </nav>
    <div class="controles">
      <div class="lang" role="group" aria-label="${t("idioma")}">
        <button type="button" data-lang="es" aria-pressed="${L === "es"}">ES</button><button type="button" data-lang="en" aria-pressed="${L === "en"}">EN</button>
      </div>
      <button type="button" class="icon-btn" id="btnTema" aria-label="${t("tema")}">${tema.get() === "dark" ? ICON.sol : ICON.luna}</button>
      <button class="cart-btn" id="btnCarrito" aria-label="${t("abrir_carrito")}">${ICON.canasta}<span id="cartTotalBtn">${S(0)}</span><span class="badge" id="cartCount">0</span></button>
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
  <div class="panel-cab"><h2>${t("canasta")}</h2><button class="cerrar" id="cerrar" aria-label="${t("cerrar")}">✕</button></div>
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
    <button class="btn btn-wa" id="enviar" disabled>${ICON.wa}${t("confirmar")}</button>
    <p class="nota">${t("nota")}</p>
  </div>
</aside>
<div class="aviso" id="aviso" role="status"></div>`;
  }

  /* ---------- montaje ---------- */
  function montar() {
    const nom = $("nombre")?.value, dir = $("direccion")?.value;
    document.documentElement.lang = lang();
    document.title = `${D.config.nombre} · ${nombre(D.config.lema, lang())}`;
    $("app").innerHTML = plantilla();
    if (nom) $("nombre").value = nom;
    if (dir) $("direccion").value = dir;
    marquesina(); categorias(); render(); actualizar(); eventos();
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
    $("cats").innerHTML = lista.map(c => `<button class="cat" data-cat="${c.id}" aria-pressed="${c.id === cat}">${esc(c.n)}</button>`).join("");
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
      ? `<div class="stepper"><button data-a="-1" data-id="${esc(id)}" aria-label="${t("quitar_uno")}">−</button><b>${n}</b><button data-a="1" data-id="${esc(id)}" aria-label="${t("agregar_uno")}">+</button></div>`
      : `<button class="add" data-a="1" data-id="${esc(id)}">${t("agregar")} <span>+</span></button>`;
  }

  /* ---------- carrito ---------- */
  function cambiar(id, d, origen) {
    const p = prod(id); if (!p) return;
    const antes = carrito[id] || 0, n = Math.max(0, antes + d);
    if (n) carrito[id] = n; else delete carrito[id];
    guardarCarrito();
    const card = document.querySelector(`.prod[data-id="${CSS.escape(id)}"]`);
    if (card) card.querySelector(".add,.stepper").outerHTML = control(id);
    if (d > 0 && origen && !origen.closest(".panel")) volar(origen, p);
    if (d > 0 && !antes) avisar(t("en_canasta", { n: nombre(p, lang()) }));
    actualizar();
  }

  function items() {
    return Object.entries(carrito).map(([id, n]) => ({ ...prod(id), n })).filter(p => p.id);
  }

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
        <div class="stepper"><button data-a="-1" data-id="${esc(p.id)}" aria-label="${t("quitar_uno")}">−</button><b>${p.n}</b><button data-a="1" data-id="${esc(p.id)}" aria-label="${t("agregar_uno")}">+</button></div>
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
    setTimeout(() => { el.remove(); const btn = $("btnCarrito"); btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }, 700);
  }
  let tAviso;
  function avisar(m) { const a = $("aviso"); a.textContent = m; a.classList.add("ver"); clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove("ver"), 1800); }
  function confeti() {
    if (reducido()) return;
    const colores = ["#E2432B", "#FFC53D", "#8BC34A", "#146B3A", "#ffffff"];
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

  /* ---------- WhatsApp ---------- */
  function enviar() {
    const li = items(); if (!li.length) return;
    const c = D.config, L = lang();
    const nom = $("nombre").value.trim(), dir = $("direccion").value.trim();
    if (!nom) { $("nombre").focus(); avisar(t("falta_nombre")); return; }
    if (modo === "delivery" && !dir) { $("direccion").focus(); avisar(t("falta_direccion")); return; }
    const sub = li.reduce((s, p) => s + p.precio * p.n, 0), env = modo === "delivery" ? c.delivery : 0;
    const msg = [
      `🧺 *${t("wa_pedido", { tienda: c.nombre })}* — ${nom}`, "",
      ...li.map(p => `• ${nombre(p, L)}: ${p.n} ${unidad(p.unidad)} — ${S(p.precio * p.n)}`), "",
      `${t("subtotal")}: ${S(sub)}`,
      modo === "delivery" ? `${t("delivery")}: ${S(env)}\n📍 ${dir}` : `🏪 ${t("wa_recojo")}`,
      `*${t("total")}: ${S(sub + env)}*`,
      sub >= c.metaYapa ? `🎁 ${t("wa_yapa")}` : "",
      "", t("wa_pago", { p: c.pagos }) + " 🙌"
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  /* ---------- eventos ---------- */
  function eventos() {
    $("btnTema").onclick = () => { tema.set(tema.get() === "dark" ? "light" : "dark"); $("btnTema").innerHTML = tema.get() === "dark" ? ICON.sol : ICON.luna; };
    document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { if (idioma.get() !== b.dataset.lang) { idioma.set(b.dataset.lang); montar(); } });
    $("buscar").oninput = e => { q = e.target.value.trim().toLowerCase(); render(); };
    $("cats").onclick = e => { const b = e.target.closest("[data-cat]"); if (!b) return; cat = b.dataset.cat; [...$("cats").children].forEach(x => x.setAttribute("aria-pressed", x.dataset.cat === cat)); render(); };
    $("btnCarrito").onclick = () => abrir(true);
    $("cerrar").onclick = $("velo").onclick = () => abrir(false);
    $("enviar").onclick = enviar;
    document.querySelectorAll('input[name="modo"]').forEach(r => r.onchange = () => { modo = r.value; actualizar(); });
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-a]"); if (b) cambiar(b.dataset.id, +b.dataset.a, b); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") abrir(false); });

  /* Si el panel guarda cambios en otra pestaña, la tienda se actualiza sola */
  window.addEventListener("storage", e => { if (e.key === Store.KEY) { D = Store.load(); montar(); } });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!document.documentElement.dataset.theme) $("btnTema").innerHTML = tema.get() === "dark" ? ICON.sol : ICON.luna; });

  montar();
})();
