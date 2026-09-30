/* ============================================================
   LEITIME · Panel de administración
   Productos, categorías, unidades, datos de la tienda y publicación.
   ============================================================ */
(() => {
  const { esc, dinero, nombre, tema, idioma, slug, clone } = Store;
  const $ = id => document.getElementById(id);
  const ICON = {
    sol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    luna: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    lapiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    copia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    arriba: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    abajo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>',
    salir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>'
  };

  /* favicon generado desde JS para no tocar el HTML */
  const fav = document.createElement("link"); fav.rel = "icon";
  fav.href = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#146B3A"/><path d="M32 14c10 0 18 8 18 18 0 12-8 18-18 18S14 44 14 32c0-10 8-18 18-18z" fill="#E2432B"/><path d="M32 12c4-4 8-4 10-2-2 2-4 4-10 6-2-4-4-4-6-4 2-2 4-2 6 0z" fill="#8BC34A"/></svg>');
  document.head.appendChild(fav);

  let D = Store.load();
  let tab = "productos", fq = "", fcat = "";
  let sesion = sessionStorage.getItem("leitime_sesion") === "1";
  const lang = () => idioma.get();
  const S = v => dinero(v, D.config);
  const guardar = () => { Store.save(D); avisar(t("p_guardado")); };
  const controles = () => `
    <div class="controles">
      <div class="lang" role="group" aria-label="${t("idioma")}"><button type="button" data-lang="es" aria-pressed="${lang() === "es"}">ES</button><button type="button" data-lang="en" aria-pressed="${lang() === "en"}">EN</button></div>
      <button type="button" class="icon-btn" id="btnTema" aria-label="${t("tema")}">${tema.get() === "dark" ? ICON.sol : ICON.luna}</button>
    </div>`;

  /* ---------- acceso ---------- */
  function login() {
    $("app").innerHTML = `
    <div class="login">
      <form id="formLogin" autocomplete="off">
        ${controles()}
        <a class="logo" href="index.html"><i></i>${esc(D.config.nombre)}<small>${t("p_titulo")}</small></a>
        <h1>${t("p_login_t")}</h1>
        <p>${t("p_login_p")}</p>
        <div class="campo"><label for="pin">${t("p_pin")}</label><input class="pin" id="pin" type="password" inputmode="numeric" maxlength="8" autofocus></div>
        <div class="error" id="errLogin"></div>
        <button class="btn btn-verde">${t("p_entrar")}</button>
        <p class="ayuda nota">${t("p_pin_ayuda")}</p>
      </form>
    </div>`;
    comunes();
    $("formLogin").onsubmit = e => {
      e.preventDefault();
      if ($("pin").value === String(D.config.pin)) { sesion = true; sessionStorage.setItem("leitime_sesion", "1"); montar(); }
      else { $("errLogin").textContent = t("p_pin_mal"); $("pin").value = ""; $("pin").focus(); }
    };
  }

  /* ---------- estructura ---------- */
  function montar() {
    document.documentElement.lang = lang();
    document.title = `${D.config.nombre} · ${t("p_titulo")}`;
    if (!sesion) return login();
    const tabs = ["productos", "categorias", "tienda", "publicar"];
    $("app").innerHTML = `
    <div class="admin">
      <header class="top"><div class="wrap">
        <a class="logo" href="index.html"><i></i>${esc(D.config.nombre)}<small>${t("p_titulo")}</small></a>
        <nav class="nav"><a href="index.html" target="_blank" rel="noopener">${t("p_ver_tienda")} ↗</a></nav>
        ${controles()}
        <button class="icon-btn" id="btnSalir" aria-label="${t("p_salir")}" title="${t("p_salir")}">${ICON.salir}</button>
      </div></header>
      <main><div class="wrap">
        <div class="tabs" role="tablist">${tabs.map(x => `<button role="tab" data-tab="${x}" aria-selected="${x === tab}">${t("p_tab_" + x)}</button>`).join("")}</div>
        <div id="vista"></div>
      </div></main>
    </div>
    <div class="aviso" id="aviso" role="status"></div>`;
    comunes();
    $("btnSalir").onclick = () => { sesion = false; sessionStorage.removeItem("leitime_sesion"); montar(); };
    document.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; montar(); });
    ({ productos: vistaProductos, categorias: vistaCategorias, tienda: vistaTienda, publicar: vistaPublicar })[tab]();
  }

  function comunes() {
    $("btnTema").onclick = () => { tema.set(tema.get() === "dark" ? "light" : "dark"); $("btnTema").innerHTML = tema.get() === "dark" ? ICON.sol : ICON.luna; };
    document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => { if (lang() !== b.dataset.lang) { idioma.set(b.dataset.lang); montar(); } });
  }

  let tAviso;
  function avisar(m) { const a = $("aviso"); if (!a) return; a.textContent = m; a.classList.add("ver"); clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove("ver"), 1600); }

  /* ---------- productos ---------- */
  function vistaProductos() {
    const L = lang();
    $("vista").innerHTML = `
    <div class="tarjeta">
      <div class="herramientas">
        <label class="buscar">${ICON.lupa}<input id="fq" type="search" placeholder="${t("p_buscar")}" value="${esc(fq)}"></label>
        <select id="fcat"><option value="">${t("p_todas")}</option>${D.categorias.map(c => `<option value="${c.id}" ${c.id === fcat ? "selected" : ""}>${esc(nombre(c, L))}</option>`).join("")}</select>
        <button class="btn btn-tomate chico" id="btnNuevo">+ ${t("p_nuevo")}</button>
      </div>
      <p class="resumen-admin" id="resumen"></p>
      <table class="tabla"><thead><tr><th>${t("p_col_prod")}</th><th>${t("p_col_cat")}</th><th>${t("p_col_precio")}</th><th>${t("p_col_visible")}</th><th></th></tr></thead><tbody id="filas"></tbody></table>
    </div>`;
    $("fq").oninput = e => { fq = e.target.value.trim().toLowerCase(); filas(); };
    $("fcat").onchange = e => { fcat = e.target.value; filas(); };
    $("btnNuevo").onclick = () => formulario();
    filas();
  }

  function filas() {
    const L = lang();
    const vis = D.productos.filter(p => p.visible !== false).length, of = D.productos.filter(p => p.antes > p.precio).length;
    $("resumen").textContent = t("p_resumen", { n: D.productos.length, v: vis, o: of });
    const lista = D.productos.map((p, i) => ({ p, i })).filter(({ p }) =>
      (!fcat || p.cat === fcat) && (!fq || nombre(p, "es").toLowerCase().includes(fq) || nombre(p, "en").toLowerCase().includes(fq)));
    $("filas").innerHTML = lista.length ? lista.map(({ p, i }) => `
      <tr class="${p.visible === false ? "invisible" : ""}" data-i="${i}">
        <td class="celda-prod"><div class="prod-celda"><span class="icono">${p.imagen ? `<img src="${esc(p.imagen)}" alt="">` : esc(p.icono || "🛒")}</span><div><b>${esc(p.es)}</b><small>${esc(p.en || "")} · ${esc(nombre(D.unidades.find(u => u.id === p.unidad), L) || p.unidad)}</small></div></div></td>
        <td><span class="pill">${esc(nombre(D.categorias.find(c => c.id === p.cat), L) || p.cat)}</span></td>
        <td class="num">${S(p.precio)}${p.antes > p.precio ? ` <s>${S(p.antes)}</s>` : ""}</td>
        <td><label class="switch"><input type="checkbox" data-vis="${i}" ${p.visible !== false ? "checked" : ""} aria-label="${t("p_col_visible")}"><i></i></label></td>
        <td><div class="acciones">
          <button class="mini" data-act="sube" data-i="${i}" title="${t("p_subir")}" ${i === 0 ? "disabled" : ""}>${ICON.arriba}</button>
          <button class="mini" data-act="baja" data-i="${i}" title="${t("p_bajar")}" ${i === D.productos.length - 1 ? "disabled" : ""}>${ICON.abajo}</button>
          <button class="mini" data-act="dup" data-i="${i}" title="${t("p_duplicar")}">${ICON.copia}</button>
          <button class="mini" data-act="edita" data-i="${i}" title="${t("p_editar")}">${ICON.lapiz}</button>
          <button class="mini peligro" data-act="borra" data-i="${i}" title="${t("p_borrar")}">${ICON.basura}</button>
        </div></td>
      </tr>`).join("") : `<tr><td colspan="5"><div class="vacio"><b>${t("p_sin_productos")}</b></div></td></tr>`;
    $("filas").onclick = e => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      const i = +b.dataset.i, p = D.productos[i];
      if (b.dataset.act === "edita") formulario(i);
      if (b.dataset.act === "dup") { const c = clone(p); c.id = idUnico(c.id); D.productos.splice(i + 1, 0, c); guardar(); filas(); }
      if (b.dataset.act === "sube" && i > 0) { [D.productos[i - 1], D.productos[i]] = [D.productos[i], D.productos[i - 1]]; guardar(); filas(); }
      if (b.dataset.act === "baja" && i < D.productos.length - 1) { [D.productos[i + 1], D.productos[i]] = [D.productos[i], D.productos[i + 1]]; guardar(); filas(); }
      if (b.dataset.act === "borra" && confirm(t("p_confirmar_borrar", { n: p.es }))) { D.productos.splice(i, 1); Store.save(D); avisar(t("p_borrado")); filas(); }
    };
    $("filas").onchange = e => { const c = e.target.closest("[data-vis]"); if (!c) return; D.productos[+c.dataset.vis].visible = c.checked; guardar(); filas(); };
  }

  function idUnico(base) {
    let id = slug(base), n = 2;
    while (D.productos.some(p => p.id === id)) id = slug(base) + "-" + n++;
    return id;
  }

  function formulario(i) {
    const L = lang(), nuevo = i === undefined;
    const p = nuevo ? { es: "", en: "", cat: D.categorias[0]?.id || "", icono: "🛒", imagen: "", precio: "", antes: "", unidad: D.unidades[0]?.id || "kg", visible: true } : D.productos[i];
    const velo = document.createElement("div"); velo.className = "modal-velo";
    velo.innerHTML = `
    <form class="modal" id="formProd">
      <h2>${nuevo ? t("p_form_nuevo") : t("p_form_editar")}</h2>
      <div class="form-grid">
        <div class="campo"><label for="f_es">${t("p_nombre_es")}</label><input id="f_es" value="${esc(p.es)}" required></div>
        <div class="campo"><label for="f_en">${t("p_nombre_en")}</label><input id="f_en" value="${esc(p.en || "")}"></div>
        <div class="campo"><label for="f_cat">${t("p_categoria")}</label><select id="f_cat">${D.categorias.map(c => `<option value="${c.id}" ${c.id === p.cat ? "selected" : ""}>${esc(nombre(c, L))}</option>`).join("")}</select></div>
        <div class="campo"><label for="f_unidad">${t("p_unidad")}</label><select id="f_unidad">${D.unidades.map(u => `<option value="${u.id}" ${u.id === p.unidad ? "selected" : ""}>${esc(nombre(u, L))}</option>`).join("")}</select></div>
        <div class="campo"><label for="f_precio">${t("p_precio")} (${esc(D.config.moneda)})</label><input id="f_precio" type="number" step="0.01" min="0" inputmode="decimal" value="${p.precio}" required></div>
        <div class="campo"><label for="f_antes">${t("p_antes")}</label><input id="f_antes" type="number" step="0.01" min="0" inputmode="decimal" value="${p.antes ?? ""}"></div>
        <div class="campo"><label for="f_icono">${t("p_icono")}</label><div class="icono-preview"><span class="muestra" id="f_muestra"></span><input id="f_icono" value="${esc(p.icono || "")}" maxlength="8"></div></div>
        <div class="campo"><label for="f_imagen">${t("p_imagen")}</label><input id="f_imagen" type="url" value="${esc(p.imagen || "")}" placeholder="https://…"></div>
        <label class="campo ancho" style="flex-direction:row;align-items:center;gap:.8rem"><span class="switch"><input type="checkbox" id="f_visible" ${p.visible !== false ? "checked" : ""}><i></i></span>${t("p_visible")}</label>
      </div>
      <div class="error" id="f_error"></div>
      <div class="acciones-form"><button type="button" class="btn btn-borde" id="f_cancelar">${t("p_cancelar")}</button><button class="btn btn-verde">${t("p_guardar")}</button></div>
    </form>`;
    document.body.appendChild(velo);
    const muestra = () => { const img = $("f_imagen").value.trim(); $("f_muestra").innerHTML = img ? `<img src="${esc(img)}" alt="">` : esc($("f_icono").value || "🛒"); };
    $("f_icono").oninput = $("f_imagen").oninput = muestra; muestra();
    const cerrar = () => velo.remove();
    $("f_cancelar").onclick = cerrar;
    velo.onclick = e => { if (e.target === velo) cerrar(); };
    document.addEventListener("keydown", function esc_(e) { if (e.key === "Escape") { cerrar(); document.removeEventListener("keydown", esc_); } });
    $("f_es").focus();
    $("formProd").onsubmit = e => {
      e.preventDefault();
      const es = $("f_es").value.trim(), en = $("f_en").value.trim();
      const precio = parseFloat($("f_precio").value), antes = $("f_antes").value ? parseFloat($("f_antes").value) : null;
      if (!es) return $("f_error").textContent = t("p_err_nombre");
      if (!(precio > 0)) return $("f_error").textContent = t("p_err_precio");
      if (antes !== null && !(antes > precio)) return $("f_error").textContent = t("p_err_antes");
      const datos = { es, en: en || es, cat: $("f_cat").value, unidad: $("f_unidad").value, icono: $("f_icono").value.trim() || "🛒", imagen: $("f_imagen").value.trim() || "", precio: +precio.toFixed(2), antes: antes === null ? null : +antes.toFixed(2), visible: $("f_visible").checked };
      if (nuevo) D.productos.push({ id: idUnico(es), ...datos }); else Object.assign(D.productos[i], datos);
      guardar(); cerrar(); filas();
    };
  }

  /* ---------- categorías y unidades ---------- */
  function vistaCategorias() {
    const lista = (tipo, items, usoDe) => items.map((c, i) => `
      <div class="item" data-tipo="${tipo}" data-i="${i}">
        <input data-campo="es" value="${esc(c.es)}" aria-label="${t("p_cat_nombre_es")}"><input data-campo="en" value="${esc(c.en)}" aria-label="${t("p_cat_nombre_en")}">
        <div class="acciones"><span class="pill">${usoDe(c.id)}</span><button class="mini peligro" data-borra="${i}" title="${t("p_borrar")}">${ICON.basura}</button></div>
      </div>`).join("") + `
      <form class="item nuevo" data-tipo="${tipo}"><input name="es" placeholder="${t("p_cat_nombre_es")}" required><input name="en" placeholder="${t("p_cat_nombre_en")}"><button class="btn btn-verde chico">${t("p_cat_agregar")}</button></form>`;
    const usoCat = id => D.productos.filter(p => p.cat === id).length;
    const usoUni = id => D.productos.filter(p => p.unidad === id).length;
    $("vista").innerHTML = `
    <div class="tarjeta"><h2>${t("p_tab_categorias")}</h2><h3>${t("p_cat_nueva")}</h3><div class="lista" id="listaCat">${lista("cat", D.categorias, usoCat)}</div></div>
    <div class="tarjeta"><h2>${t("p_unidades")}</h2><h3>${t("p_unidad_nueva")}</h3><div class="lista" id="listaUni">${lista("uni", D.unidades, usoUni)}</div></div>`;
    const col = tipo => tipo === "cat" ? D.categorias : D.unidades;
    $("vista").onchange = e => {
      const inp = e.target.closest("[data-campo]"); if (!inp) return;
      const it = inp.closest(".item"); col(it.dataset.tipo)[+it.dataset.i][inp.dataset.campo] = inp.value.trim(); guardar();
    };
    $("vista").onclick = e => {
      const b = e.target.closest("[data-borra]"); if (!b) return;
      const it = b.closest(".item"), tipo = it.dataset.tipo, i = +it.dataset.i, c = col(tipo)[i];
      const uso = tipo === "cat" ? usoCat(c.id) : usoUni(c.id);
      if (uso) return alert(t(tipo === "cat" ? "p_cat_en_uso" : "p_unidad_en_uso", { n: uso }));
      if (confirm(t("p_cat_confirmar", { n: c.es }))) { col(tipo).splice(i, 1); guardar(); vistaCategorias(); }
    };
    $("vista").onsubmit = e => {
      e.preventDefault();
      const f = e.target, tipo = f.dataset.tipo, es = f.es.value.trim(), en = f.en.value.trim() || es;
      let id = slug(es), n = 2; while (col(tipo).some(x => x.id === id)) id = slug(es) + "-" + n++;
      col(tipo).push({ id, es, en }); guardar(); vistaCategorias();
    };
  }

  /* ---------- tienda ---------- */
  function vistaTienda() {
    const c = D.config, L = lang(), dias = t("dias");
    const horas = sel => Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${h === sel ? "selected" : ""}>${Store.hora(h)}</option>`).join("");
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
        <div class="campo ancho"><span>${t("p_tienda_dias")}</span><div class="dias-check">${[1, 2, 3, 4, 5, 6, 0].map(d => `<label><input type="checkbox" name="dia" value="${d}" ${c.dias.includes(d) ? "checked" : ""}>${dias[d]}</label>`).join("")}</div></div>
      </div>
      <div class="acciones-form"><button class="btn btn-verde">${t("p_guardar")}</button></div>
    </form>
    <form class="tarjeta" id="formPin">
      <h2>${t("p_tienda_seguridad")}</h2>
      <div class="form-grid"><div class="campo"><label for="c_pin">${t("p_tienda_pin")}</label><input id="c_pin" type="password" inputmode="numeric" minlength="4" maxlength="8" autocomplete="new-password"></div></div>
      <div class="error" id="errPin"></div>
      <div class="acciones-form"><button class="btn btn-borde">${t("p_guardar")}</button></div>
    </form>`;
    $("formTienda").onsubmit = e => {
      e.preventDefault();
      Object.assign(D.config, {
        nombre: $("c_nombre").value.trim(), whatsapp: $("c_wa").value.replace(/\D/g, ""),
        lema: { es: $("c_lema_es").value.trim(), en: $("c_lema_en").value.trim() || $("c_lema_es").value.trim() },
        moneda: $("c_moneda").value.trim(), delivery: +parseFloat($("c_delivery").value || 0).toFixed(2), metaYapa: +parseFloat($("c_yapa").value || 0).toFixed(2),
        pagos: $("c_pagos").value.trim(), direccion: { es: $("c_dir_es").value.trim(), en: $("c_dir_en").value.trim() || $("c_dir_es").value.trim() },
        horaAbre: +$("c_abre").value, horaCierra: +$("c_cierra").value,
        dias: [...document.querySelectorAll('input[name="dia"]:checked')].map(x => +x.value)
      });
      guardar(); montar();
    };
    $("formPin").onsubmit = e => {
      e.preventDefault();
      const v = $("c_pin").value.trim();
      if (!/^\d{4,8}$/.test(v)) return $("errPin").textContent = t("p_tienda_pin_err");
      D.config.pin = v; Store.save(D); $("c_pin").value = ""; $("errPin").textContent = ""; avisar(t("p_tienda_pin_ok"));
    };
  }

  /* ---------- publicar ---------- */
  function vistaPublicar() {
    const local = Store.hasLocal();
    $("vista").innerHTML = `
    <div class="tarjeta">
      <h2>${t("p_pub_t")}</h2>
      <p>${t("p_pub_p")}</p>
      <div class="pub-estado ${local ? "local" : ""}"><i></i>${local ? t("p_pub_estado_local") : t("p_pub_estado_limpio")}</div>
      <div class="herramientas">
        <button class="btn btn-tomate" id="btnData">${t("p_pub_descargar")}</button>
        <button class="btn btn-borde" id="btnExportar">${t("p_pub_exportar")}</button>
        <label class="btn btn-borde" for="inpImportar">${t("p_pub_importar")}</label><input type="file" id="inpImportar" accept="application/json,.json" class="sr">
      </div>
      <h3>${t("p_pub_pasos")}</h3>
      <ol class="pasos-pub"><li>${t("p_pub_paso1")}</li><li>${t("p_pub_paso2")}</li><li>${t("p_pub_paso3")}</li></ol>
    </div>
    <div class="tarjeta"><div class="herramientas" style="margin:0"><button class="btn btn-peligro" id="btnReset">${t("p_pub_reset")}</button></div></div>`;
    const descargar = (nombreArchivo, contenido, tipo) => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([contenido], { type: tipo })); a.download = nombreArchivo; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    const paquete = () => ({ version: LEITIME_DEFAULT.version, config: D.config, categorias: D.categorias, unidades: D.unidades, productos: D.productos });
    $("btnData").onclick = () => descargar("data.js", `/* ${D.config.nombre} · generado desde el panel el ${new Date().toLocaleString()} */\nwindow.LEITIME_DEFAULT = ${JSON.stringify(paquete(), null, 2)};\n`, "text/javascript");
    $("btnExportar").onclick = () => descargar(`leitime-copia-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(paquete(), null, 2), "application/json");
    $("inpImportar").onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(txt => {
        const d = JSON.parse(txt);
        if (!d || !Array.isArray(d.productos) || !d.config) throw 0;
        D = { version: LEITIME_DEFAULT.version, config: { ...LEITIME_DEFAULT.config, ...d.config }, categorias: d.categorias || D.categorias, unidades: d.unidades || D.unidades, productos: d.productos };
        Store.save(D); avisar(t("p_pub_importado")); montar();
      }).catch(() => alert(t("p_pub_import_err")));
    };
    $("btnReset").onclick = () => { if (confirm(t("p_pub_reset_confirmar"))) { Store.reset(); D = Store.load(); montar(); } };
  }

  montar();
})();
