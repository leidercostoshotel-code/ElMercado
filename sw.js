/* El Mercado de Amazonas · Service worker
   - Shell (HTML, CSS, JS, íconos): cache-first con actualización en segundo plano
   - Fuentes de Google: cache-first
   - Firebase (Firestore, Auth, Storage, gstatic SDK): siempre red, sin cachear (Firestore ya tiene su caché local)
   - Navegaciones: network-first con respaldo al shell en caché */
const VERSION = "mercado-v4";
const SHELL = ["/", "/index.html", "/admin.html", "/404.html", "/manifest.json", "/css/styles.css",
  "/js/app.js", "/js/admin.js", "/js/db.js", "/js/data.js", "/js/i18n.js", "/js/store.js", "/js/traducir.js", "/js/firebase-config.js",
  "/img/icon-192.png", "/img/icon-512.png"];
const SOLO_RED = ["firestore.googleapis.com", "firebasestorage.googleapis.com", "identitytoolkit.googleapis.com", "securetoken.googleapis.com", "www.googleapis.com", "wa.me", "api.whatsapp.com"];

self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  if (SOLO_RED.some(h => url.hostname.endsWith(h))) return;                                   // datos: siempre red
  if (req.mode === "navigate") {                                                             // páginas: red primero
    e.respondWith(fetch(req).then(r => { const copia = r.clone(); caches.open(VERSION).then(c => c.put(req, copia)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match("/index.html"))));
    return;
  }
  const esShell = url.origin === location.origin, esFuente = url.hostname.includes("fonts.g"), esSDK = url.hostname === "www.gstatic.com";
  if (esShell || esFuente || esSDK) {                                                        // shell y fuentes: caché primero, se refresca en segundo plano
    e.respondWith(caches.match(req).then(hit => {
      const red = fetch(req).then(r => { if (r.ok) caches.open(VERSION).then(c => c.put(req, r.clone())); return r; }).catch(() => hit);
      return hit || red;
    }));
    return;
  }
  if (url.hostname.includes("unsplash") || /\.(png|jpe?g|webp|avif|gif)$/i.test(url.pathname)) {   // imágenes de producto: caché primero
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) caches.open(VERSION + "-img").then(c => c.put(req, r.clone())); return r; })));
  }
});
