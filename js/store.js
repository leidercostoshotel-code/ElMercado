/* ============================================================
   LEITIME · Preferencias del navegador y utilidades compartidas
   (los datos de la tienda viven en Firebase, ver db.js)
   ============================================================ */
const get = k => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

export const tema = {
  get: () => document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  set(v) { document.documentElement.dataset.theme = v; set("leitime_tema", v); }
};
export const idioma = {
  get: () => (document.documentElement.lang === "en" ? "en" : "es"),
  set(v) { document.documentElement.lang = v; set("leitime_idioma", v); }
};
export const carritoLocal = {
  get() { try { return JSON.parse(get("leitime_carrito") || "{}"); } catch { return {}; } },
  set(c) { set("leitime_carrito", JSON.stringify(c)); }
};

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const dinero = (v, cfg) => `${cfg.moneda || "S/"} ${Number(v || 0).toFixed(2)}`;
export const hora = h => { const n = Number(h), s = n % 12 || 12, en = document.documentElement.lang === "en"; return `${s}:00 ${n < 12 ? (en ? "AM" : "a. m.") : (en ? "PM" : "p. m.")}`; };
export const nombre = (obj, lang) => (obj ? (obj[lang] || obj.es || obj.en || "") : "");
export const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
export const clone = o => JSON.parse(JSON.stringify(o));
/* Foto del producto: la subida por el administrador, o la incluida si el id o el nombre coinciden */
export function imagenProducto(p, imagenes = {}) {
  if (p?.imagen) return p.imagen;
  const porNombre = slug(p?.es || "");
  const alias = { "aji-amarillo": "aji", "papa-amarilla": "papa", "cebolla-roja": "cebolla", "maracuya": "maracuya", "ajo": "ajos", "jengibre": "kion", "kion": "kion",
    "camote-amarillo": "camote", "pimiento": "pimenton", "arveja": "alverjita", "arvejita": "alverjita", "alverja": "alverjita", "vainitas": "vainita", "haba": "habas", "zapallo-macre": "zapallo" };
  return imagenes[p?.id] || imagenes[porNombre] || imagenes[alias[porNombre]] || "";
}
export const fecha = d => new Intl.DateTimeFormat(document.documentElement.lang === "en" ? "en-US" : "es-PE", { dateStyle: "medium", timeStyle: "short" }).format(d);

/* Favicon generado desde JS para no tocar el HTML */
export function favicon() {
  const fav = document.createElement("link"); fav.rel = "icon";
  fav.href = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#146B3A"/><path d="M32 14c10 0 18 8 18 18 0 12-8 18-18 18S14 44 14 32c0-10 8-18 18-18z" fill="#E2432B"/><path d="M32 12c4-4 8-4 10-2-2 2-4 4-10 6-2-4-4-4-6-4 2-2 4-2 6 0z" fill="#8BC34A"/></svg>');
  document.head.appendChild(fav);
}

export const ICON = {
  sol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  luna: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  canasta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M3 10h18l-1.6 9a2 2 0 0 1-2 1.6H6.6a2 2 0 0 1-2-1.6L3 10z"/><path d="m7 10 3-6M17 10l-3-6M9 14v3M15 14v3"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 5.2 5.2 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  lapiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  copia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  arriba: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  abajo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>',
  salir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  nube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 .4-9A7 7 0 0 0 4.3 12.5 3.5 3.5 0 0 0 6 19z"/></svg>'
};

/* ---------- apariencia (colores y letras elegidas en el panel) ---------- */
export const FUENTES = {
  titulos: ["Bricolage Grotesque", "Fraunces", "Playfair Display", "Anton", "Bebas Neue", "Lilita One", "Righteous", "Archivo Black", "Alfa Slab One", "Pacifico", "Baloo 2", "Poppins"],
  texto: ["DM Sans", "Inter", "Nunito", "Poppins", "Source Sans 3", "Work Sans", "Lato", "Roboto"]
};
export const APARIENCIA_BASE = { primario: "#146B3A", acento: "#E2432B", resalte: "#FFC53D", fuenteTitulos: "Bricolage Grotesque", fuenteTexto: "DM Sans" };
const HEX = /^#([0-9a-f]{3}){1,2}$/i;
let fuentesCargadas = "";
export function aplicarApariencia(ap = {}) {
  const a = { ...APARIENCIA_BASE, ...ap }, r = document.documentElement.style;
  if (HEX.test(a.primario)) r.setProperty("--verde", a.primario);
  if (HEX.test(a.acento)) r.setProperty("--tomate", a.acento);
  if (HEX.test(a.resalte)) r.setProperty("--mango", a.resalte);
  r.setProperty("--fuente-titulos", `"${a.fuenteTitulos}"`);
  r.setProperty("--fuente-texto", `"${a.fuenteTexto}"`);
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta && HEX.test(a.primario)) meta.content = a.primario;
  cargarFuentes([a.fuenteTitulos, a.fuenteTexto]);
}
export function cargarFuentes(lista) {
  const fams = [...new Set(lista.filter(Boolean))].map(f => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;700;800`).join("&");
  if (!fams || fams === fuentesCargadas) return;
  fuentesCargadas = fams;
  const l = document.createElement("link"); l.rel = "stylesheet"; l.href = `https://fonts.googleapis.com/css2?${fams}&display=swap`;
  document.head.appendChild(l);
}
