/* ============================================================
   LEITIME · Almacenamiento (catálogo, preferencias)
   ============================================================ */
window.Store = (() => {
  const KEY = "leitime_datos";
  const clone = o => JSON.parse(JSON.stringify(o));
  const get = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const del = k => { try { localStorage.removeItem(k); } catch {} };

  /* Catálogo: valores por defecto + lo guardado desde el panel */
  function load() {
    const base = clone(LEITIME_DEFAULT);
    try {
      const local = JSON.parse(get(KEY) || "null");
      if (local && Array.isArray(local.productos)) {
        return {
          version: base.version,
          config: { ...base.config, ...local.config },
          categorias: local.categorias || base.categorias,
          unidades: local.unidades || base.unidades,
          productos: local.productos
        };
      }
    } catch {}
    return base;
  }
  const save = d => set(KEY, JSON.stringify(d));
  const reset = () => del(KEY);
  const hasLocal = () => !!get(KEY);

  /* Preferencias de tema e idioma (las lee también el script de la cabecera) */
  const tema = {
    get: () => document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    set(v) { document.documentElement.dataset.theme = v; set("leitime_tema", v); }
  };
  const idioma = {
    get: () => (document.documentElement.lang === "en" ? "en" : "es"),
    set(v) { document.documentElement.lang = v; set("leitime_idioma", v); }
  };

  /* Utilidades compartidas */
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const dinero = (v, cfg) => `${cfg.moneda} ${Number(v || 0).toFixed(2)}`;
  const hora = h => { const n = Number(h), s = n % 12 || 12, en = document.documentElement.lang === "en"; return `${s}:00 ${n < 12 ? (en ? "AM" : "a. m.") : (en ? "PM" : "p. m.")}`; };
  const nombre = (obj, lang) => (obj ? (obj[lang] || obj.es || obj.en || "") : "");
  const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";

  return { KEY, load, save, reset, hasLocal, tema, idioma, esc, dinero, hora, nombre, slug, clone };
})();
