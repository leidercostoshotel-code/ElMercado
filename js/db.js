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
import { firebaseConfig } from "./firebase-config.js";

export const configurado = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
let db, auth;
if (configurado) {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, { localCache: persistentLocalCache() });
  auth = getAuth(app);
}
const refConfig = () => doc(db, "tienda", "config");
const refCatalogo = () => doc(db, "tienda", "catalogo");
const refProductos = () => collection(db, "productos");
const refPedidos = () => collection(db, "pedidos");
const limpiar = o => JSON.parse(JSON.stringify(o));

/* Tienda en tiempo real: config + catálogo + productos.
   cb recibe { listo, config, categorias, unidades, productos } en cada cambio. */
export function suscribirTienda(cb) {
  if (!configurado) { cb({ listo: false, sinFirebase: true }); return () => {}; }
  const estado = { config: null, catalogo: null, productos: null };
  const emitir = () => {
    if (estado.config === null || estado.catalogo === null || estado.productos === null) return;
    cb({ listo: true, config: estado.config, categorias: estado.catalogo.categorias || [], unidades: estado.catalogo.unidades || [], productos: estado.productos });
  };
  const error = e => cb({ listo: false, error: e });
  const u1 = onSnapshot(refConfig(), s => { estado.config = s.exists() ? s.data() : {}; emitir(); }, error);
  const u2 = onSnapshot(refCatalogo(), s => { estado.catalogo = s.exists() ? s.data() : {}; emitir(); }, error);
  const u3 = onSnapshot(query(refProductos(), orderBy("orden")), s => { estado.productos = s.docs.map(d => ({ id: d.id, ...d.data() })); emitir(); }, error);
  return () => { u1(); u2(); u3(); };
}

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
  semilla.productos.forEach((p, i) => { const { id, ...datos } = p; b.set(doc(db, "productos", id), { ...limpiar(datos), orden: i }); });
  await b.commit();
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
