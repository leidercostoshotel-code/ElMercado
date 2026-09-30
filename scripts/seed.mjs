#!/usr/bin/env node
/* ============================================================
   Carga el catálogo de ejemplo (js/data.js) en Firestore por REST.
   Pensado para Cloud Shell, donde gcloud ya está autenticado:

     cd ElMercado
     node scripts/seed.mjs

   Requiere Node 18+. Usa el token de `gcloud auth print-access-token`
   (o la variable TOKEN si la defines). No borra nada: escribe o
   actualiza tienda/config, tienda/catalogo y productos/{id}.
   ============================================================ */
import { execSync } from "node:child_process";
import { SEMILLA } from "../js/data.js";

const PROJECT = process.env.PROJECT || "elmercadodeas";
const token = process.env.TOKEN || execSync("gcloud auth print-access-token").toString().trim();
const base = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

/* JSON → formato de valores de Firestore */
const val = v => v === null || v === undefined ? { nullValue: null }
  : typeof v === "boolean" ? { booleanValue: v }
  : typeof v === "number" ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v })
  : typeof v === "string" ? { stringValue: v }
  : Array.isArray(v) ? { arrayValue: { values: v.map(val) } }
  : { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, val(x)])) } };
const fields = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, val(v)]));

async function commit(writes) {
  const r = await fetch(`${base}:commit`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ writes }) });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
}
const docWrite = (path, data) => ({ update: { name: `${base.replace(/^https:\/\/firestore\.googleapis\.com\/v1\//, "")}/${path}`, fields: fields(data) }, updateMask: { fieldPaths: Object.keys(data) } });

const writes = [
  docWrite("tienda/config", SEMILLA.config),
  docWrite("tienda/catalogo", { categorias: SEMILLA.categorias, unidades: SEMILLA.unidades }),
  ...SEMILLA.productos.map((p, i) => { const { id, ...d } = p; return docWrite(`productos/${id}`, { activo: true, ...d, orden: i }); })
];
for (let i = 0; i < writes.length; i += 400) await commit(writes.slice(i, i + 400));
console.log(`✓ Cargados ${SEMILLA.productos.length} productos, ${SEMILLA.categorias.length} categorías y la configuración en el proyecto ${PROJECT}.`);
