/* ============================================================
   LEITIME · Capa de datos (Firebase: Firestore + Auth)
   ------------------------------------------------------------
   Colecciones:
     tienda/config     → datos de la tienda (nombre, WhatsApp, delivery…)
     tienda/catalogo   → categorías y unidades
     productos/{id}    → un documento por producto
     pedidos/{id}      → pedidos confirmados desde la tienda
   ============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  initializeFirestore, persistentLocalCache, doc, collection, onSnapshot, setDoc, deleteDoc, addDoc,
  query, orderBy, limit, serverTimestamp, writeBatch, updateDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

export const configurado = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
let db, auth, storage;
if (configurado) {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, { localCache: persistentLocalCache() });
  auth = getAuth(app);
  storage = getStorage(app);
}
const refConfig = () => doc(db, "tienda", "config");
const refCatalogo = () => doc(db, "tienda", "catalogo");
const refProductos = () => collection(db, "productos");
const refPedidos = () => collection(db, "pedidos");
const limpiar = o => JSON.parse(JSON.stringify(o));

/* Tienda en tiempo real: config + catálogo + productos.
   cb recibe en cada cambio:
     { listo, config, categorias, unidades, productos, cargando, error, fromCache }
   - cargando: true mientras Firebase no ha respondido con los productos
   - error:    objeto de error si la conexión o las reglas fallaron (la escucha se corta; usa el
               retorno de esta función para cancelar y vuelve a llamarla para reintentar) */
export function suscribirTienda(cb) {
  if (!configurado) { cb({ listo: false, sinFirebase: true }); return () => {}; }
  const estado = { config: null, catalogo: null, productos: null, fromCache: false };
  const emitir = () => cb({
    listo: estado.config !== null && estado.catalogo !== null,
    cargando: estado.productos === null,
    fromCache: estado.fromCache,
    config: estado.config || {},
    categorias: estado.catalogo?.categorias || [],
    unidades: estado.catalogo?.unidades || [],
    productos: estado.productos || []
  });
  const error = e => { console.error("[Firestore] No se pudo leer la tienda:", e?.code || e); cb({ listo: estado.config !== null, error: e, config: estado.config || {}, categorias: estado.catalogo?.categorias || [], unidades: estado.catalogo?.unidades || [], productos: estado.productos || [] }); };
  const u1 = onSnapshot(refConfig(), s => { estado.config = s.exists() ? s.data() : {}; emitir(); }, error);
  const u2 = onSnapshot(refCatalogo(), s => { estado.catalogo = s.exists() ? s.data() : {}; emitir(); }, error);
  const u3 = onSnapshot(refProductos(), { includeMetadataChanges: true }, s => {
    /* con caché local el primer snapshot puede venir vacío "fromCache"; lo ignoramos si aún no hay datos para no mostrar "0 productos" */
    if (s.metadata.fromCache && s.empty && estado.productos === null) return;
    estado.fromCache = s.metadata.fromCache;
    estado.productos = s.docs.map(d => ({ id: d.id, ...d.data() }));
    emitir();
  }, error);
  return () => { u1(); u2(); u3(); };
}

/* Orden público: primero por categoría (según el orden del catálogo), luego por `orden` */
export function ordenarProductos(productos, categorias) {
  const pos = new Map((categorias || []).map((c, i) => [c.id, i]));
  return productos.slice().sort((a, b) => ((pos.get(a.cat) ?? 999) - (pos.get(b.cat) ?? 999)) || ((a.orden ?? 0) - (b.orden ?? 0)) || String(a.es || "").localeCompare(String(b.es || "")));
}
export const esActivo = p => p.activo !== false && p.visible !== false;

/* Escrituras (requieren sesión iniciada según las reglas) */
export const guardarConfig = cfg => setDoc(refConfig(), limpiar(cfg), { merge: true });
export const guardarCatalogo = cat => setDoc(refCatalogo(), limpiar(cat), { merge: true });
export const guardarProducto = (id, datos) => setDoc(doc(db, "productos", id), limpiar(datos), { merge: true });
export const borrarProducto = id => deleteDoc(doc(db, "productos", id));
export async function reordenar(productos) {
  const b = writeBatch(db);
  productos.forEach((p, i) => { if (p.orden !== i) b.update(doc(db, "productos", p.id), { orden: i }); });
  await b.commit();
}
export async function sembrar(semilla) {
  const b = writeBatch(db);
  b.set(refConfig(), limpiar(semilla.config), { merge: true });
  b.set(refCatalogo(), { categorias: semilla.categorias, unidades: semilla.unidades }, { merge: true });
  semilla.productos.forEach((p, i) => { const { id, ...datos } = p; b.set(doc(db, "productos", id), { activo: true, ...limpiar(datos), orden: datos.orden ?? i }, { merge: true }); });
  await b.commit();
}
/* Importación en lote (máx. 400 por commit, límite de Firestore es 500) */
export async function guardarProductos(lista) {
  for (let i = 0; i < lista.length; i += 400) {
    const b = writeBatch(db);
    lista.slice(i, i + 400).forEach(({ id, ...datos }) => b.set(doc(db, "productos", id), limpiar(datos), { merge: true }));
    await b.commit();
  }
}
/* Imagen de producto → Firebase Storage (productos/{id}.{ext}) */
export async function subirImagen(archivo, id) {
  const ext = (archivo.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const carpeta = id.startsWith("portada") ? "portada" : "productos";
  const r = refStorage(storage, `${carpeta}/${id}-${Date.now()}.${ext}`);
  await uploadBytes(r, archivo, { contentType: archivo.type || "image/jpeg", cacheControl: "public, max-age=31536000" });
  return getDownloadURL(r);
}

/* Pedidos */
export const crearPedido = p => addDoc(refPedidos(), { ...limpiar(p), estado: "nuevo", creado: serverTimestamp() });
export function suscribirPedidos(cb, max = 200) {
  return onSnapshot(query(refPedidos(), orderBy("creado", "desc"), limit(max)),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data(), creado: d.data().creado?.toDate?.() || new Date() }))),
    e => cb([], e));
}
export const actualizarPedido = (id, datos) => updateDoc(doc(db, "pedidos", id), datos);
export const borrarPedido = id => deleteDoc(doc(db, "pedidos", id));

/* Sesión del panel */
export const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);
export const onAuth = cb => (configurado ? onAuthStateChanged(auth, cb) : (cb(null), () => {}));
