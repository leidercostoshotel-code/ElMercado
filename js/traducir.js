/* ============================================================
   El Mercado de Amazonas · Traducción automática español → inglés
   ------------------------------------------------------------
   1. Diccionario local de productos de mercado (instantáneo y sin red).
   2. Si no está, servicio gratuito MyMemory (sin clave).
   3. Si nada responde, se deja el texto en español.
   El resultado siempre se puede corregir a mano en el panel.
   ============================================================ */
const DIC = {
  /* categorías */
  "frutas": "Fruit", "fruta": "Fruit", "verduras": "Vegetables", "verdura": "Vegetables", "hortalizas": "Vegetables",
  "carnes": "Meat", "carne": "Meat", "abarrotes": "Pantry", "lacteos": "Dairy", "lácteos": "Dairy", "bebidas": "Drinks",
  "pescados": "Fish", "mariscos": "Seafood", "pescados y mariscos": "Fish & seafood", "aves": "Poultry", "embutidos": "Cold cuts",
  "panaderia": "Bakery", "panadería": "Bakery", "limpieza": "Cleaning", "huevos": "Eggs", "granos": "Grains", "menestras": "Legumes",
  "hierbas": "Herbs", "especias": "Spices", "condimentos": "Seasonings", "congelados": "Frozen", "snacks": "Snacks", "dulces": "Sweets",
  "tuberculos": "Tubers", "tubérculos": "Tubers", "organicos": "Organic", "orgánicos": "Organic", "ofertas": "Deals",
  /* unidades */
  "kg": "kg", "kilo": "kilo", "kilos": "kilos", "gramo": "gram", "gramos": "grams", "g": "g", "unidad": "each", "unidades": "units",
  "atado": "bunch", "manojo": "bunch", "paquete": "pack", "bolsa": "bag", "docena": "dozen", "media docena": "half dozen",
  "litro": "liter", "litros": "liters", "botella": "bottle", "lata": "can", "caja": "box", "bandeja": "tray", "racimo": "bunch",
  "libra": "pound", "saco": "sack", "malla": "mesh bag", "sobre": "packet", "frasco": "jar", "porcion": "portion", "porción": "portion",
  /* frutas */
  "palta": "Avocado", "aguacate": "Avocado", "platano": "Banana", "plátano": "Banana", "manzana": "Apple", "pera": "Pear",
  "naranja": "Orange", "mandarina": "Tangerine", "limon": "Lime", "limón": "Lime", "pina": "Pineapple", "piña": "Pineapple",
  "mango": "Mango", "fresa": "Strawberry", "fresas": "Strawberries", "uva": "Grapes", "uvas": "Grapes", "sandia": "Watermelon",
  "sandía": "Watermelon", "melon": "Melon", "melón": "Melon", "papaya": "Papaya", "durazno": "Peach", "coco": "Coconut",
  "maracuya": "Passion fruit", "maracuyá": "Passion fruit", "granadilla": "Granadilla", "chirimoya": "Custard apple",
  "lucuma": "Lucuma", "lúcuma": "Lucuma", "aguaymanto": "Goldenberry", "tuna": "Prickly pear", "kiwi": "Kiwi", "cereza": "Cherry",
  "arandanos": "Blueberries", "arándanos": "Blueberries", "camu camu": "Camu camu", "cocona": "Cocona", "aguaje": "Aguaje",
  "carambola": "Star fruit", "guanabana": "Soursop", "guanábana": "Soursop", "pitahaya": "Dragon fruit", "higo": "Fig",
  /* verduras */
  "tomate": "Tomato", "tomates": "Tomatoes", "lechuga": "Lettuce", "papa": "Potato", "papas": "Potatoes", "camote": "Sweet potato",
  "yuca": "Cassava", "cebolla": "Onion", "cebolla roja": "Red onion", "cebolla china": "Spring onion", "ajo": "Garlic",
  "zanahoria": "Carrot", "zanahorias": "Carrots", "pimiento": "Bell pepper", "pimientos": "Bell peppers", "aji": "Chili pepper",
  "ají": "Chili pepper", "aji amarillo": "Yellow chili", "ají amarillo": "Yellow chili", "rocoto": "Rocoto pepper",
  "choclo": "Corn on the cob", "maiz": "Corn", "maíz": "Corn", "brocoli": "Broccoli", "brócoli": "Broccoli", "coliflor": "Cauliflower",
  "repollo": "Cabbage", "col": "Cabbage", "espinaca": "Spinach", "acelga": "Chard", "apio": "Celery", "pepino": "Cucumber",
  "zapallo": "Squash", "zapallito": "Zucchini", "calabacin": "Zucchini", "calabacín": "Zucchini", "berenjena": "Eggplant",
  "culantro": "Cilantro", "cilantro": "Cilantro", "perejil": "Parsley", "huacatay": "Black mint", "albahaca": "Basil",
  "hierbabuena": "Mint", "menta": "Mint", "vainita": "Green beans", "vainitas": "Green beans", "arveja": "Peas", "arvejas": "Peas",
  "habas": "Fava beans", "beterraga": "Beet", "betarraga": "Beet", "rabanito": "Radish", "nabo": "Turnip", "poro": "Leek",
  "champiñones": "Mushrooms", "hongos": "Mushrooms", "olluco": "Olluco", "oca": "Oca", "kion": "Ginger", "jengibre": "Ginger",
  "palmito": "Heart of palm", "sacha culantro": "Sawtooth coriander", "cocona": "Cocona",
  /* carnes */
  "pollo": "Chicken", "pollo entero": "Whole chicken", "pecho de pollo": "Chicken breast", "pierna de pollo": "Chicken leg",
  "alitas": "Chicken wings", "res": "Beef", "carne de res": "Beef", "bistec": "Steak", "lomo": "Tenderloin", "lomo fino": "Beef tenderloin",
  "carne molida": "Ground beef", "cerdo": "Pork", "chuleta": "Chop", "chuleta de cerdo": "Pork chop", "costilla": "Ribs",
  "tocino": "Bacon", "jamon": "Ham", "jamón": "Ham", "chorizo": "Sausage", "salchicha": "Sausage", "hotdog": "Hot dog",
  "cordero": "Lamb", "pavo": "Turkey", "higado": "Liver", "hígado": "Liver", "mondongo": "Tripe", "cecina": "Cured pork",
  "pescado": "Fish", "paiche": "Paiche", "doncella": "Doncella fish", "tilapia": "Tilapia", "trucha": "Trout", "bonito": "Bonito",
  "cabrilla": "Cabrilla", "langostino": "Prawn", "langostinos": "Prawns", "pota": "Squid", "conchas": "Scallops",
  /* abarrotes */
  "arroz": "Rice", "arroz extra": "Extra rice", "azucar": "Sugar", "azúcar": "Sugar", "azucar rubia": "Brown sugar",
  "azúcar rubia": "Brown sugar", "sal": "Salt", "aceite": "Oil", "aceite vegetal": "Vegetable oil", "fideos": "Pasta",
  "tallarin": "Spaghetti", "tallarín": "Spaghetti", "harina": "Flour", "leche": "Milk", "leche evaporada": "Evaporated milk",
  "queso": "Cheese", "queso fresco": "Fresh cheese", "mantequilla": "Butter", "yogur": "Yogurt", "huevo": "Egg",
  "pan": "Bread", "avena": "Oats", "lentejas": "Lentils", "frejol": "Beans", "frejoles": "Beans", "frijoles": "Beans",
  "garbanzos": "Chickpeas", "cafe": "Coffee", "café": "Coffee", "te": "Tea", "té": "Tea", "chocolate": "Chocolate",
  "cacao": "Cocoa", "miel": "Honey", "mermelada": "Jam", "atun": "Tuna", "atún": "Tuna", "sardina": "Sardines",
  "vinagre": "Vinegar", "agua": "Water", "gaseosa": "Soda", "galletas": "Cookies", "mani": "Peanuts", "maní": "Peanuts",
  "quinua": "Quinoa", "farina": "Farina", "chuño": "Freeze-dried potato", "fariña": "Cassava flour",
  /* adjetivos frecuentes (para frases cortas) */
  "fresco": "fresh", "fresca": "fresh", "frescos": "fresh", "frescas": "fresh", "organico": "organic", "orgánico": "organic",
  "rojo": "red", "roja": "red", "verde": "green", "amarillo": "yellow", "amarilla": "yellow", "blanco": "white", "blanca": "white",
  "morado": "purple", "morada": "purple", "grande": "large", "pequeño": "small", "pequeña": "small", "entero": "whole", "entera": "whole",
  "fuerte": "Fuerte", "hass": "Hass", "seda": "silk", "israel": "Israel", "golden": "golden", "kent": "Kent", "serrano": "Andean",
  "dulce": "sweet", "nacional": "local", "importado": "imported", "importada": "imported", "selecta": "select", "selecto": "select"
};
const norm = s => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
const sinTildes = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const buscar = s => DIC[s] ?? DIC[sinTildes(s)];
const capital = (orig, tr) => (orig && orig[0] === orig[0].toUpperCase() && orig[0] !== orig[0].toLowerCase()) ? tr.charAt(0).toUpperCase() + tr.slice(1) : tr;
const cache = new Map();

/* Traducción local: frase exacta, o "sustantivo + adjetivo(s)" invirtiendo el orden (Palta fuerte → Fuerte avocado). */
function local(texto) {
  const n = norm(texto); if (!n) return "";
  const exacto = buscar(n); if (exacto) return exacto;
  const sinNum = String(texto).trim().match(/^(.*?)(\s+\d.*)$/);   // "Aceite vegetal 1 L" → traduce y conserva "1 L"
  if (sinNum) { const base = local(sinNum[1]); if (base) return base + " " + sinNum[2].trim(); }
  const de = n.split(" de ");                                        // "pecho de pollo" → "chicken breast"
  if (de.length === 2 && buscar(de[0]) && buscar(de[1])) return `${buscar(de[1]).toLowerCase()} ${buscar(de[0]).toLowerCase()}`;
  const w = n.split(" ");
  if (w.length > 1 && w.length <= 3 && buscar(w[0]) && w.slice(1).every(x => buscar(x))) {
    return [...w.slice(1).map(x => buscar(x).toLowerCase()), buscar(w[0]).toLowerCase()].join(" ");
  }
  return "";
}

/* Traduce español → inglés. Devuelve el texto original si no hay traducción. */
export async function traducir(texto) {
  const t = String(texto || "").trim(); if (!t) return "";
  if (cache.has(t)) return cache.get(t);
  let r = local(t);
  if (!r) {
    try {
      const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(t)}&langpair=es|en`, { signal: ctrl.signal });
      clearTimeout(timer);
      const j = await res.json();
      const tr = j?.responseData?.translatedText;
      if (j?.responseStatus === 200 && tr && !/MYMEMORY WARNING|QUERY LENGTH/i.test(tr)) r = tr.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    } catch (e) { console.warn("[Traducir] Servicio no disponible, se usa el texto original.", e?.name || e); }
  }
  r = r ? capital(t, r.trim()) : t;
  cache.set(t, r);
  return r;
}

/* Conecta un campo en español con su par en inglés:
   - mientras escribes en español, rellena el inglés (si está vacío o lo había rellenado la traducción)
   - si editas el inglés a mano, ya no se sobrescribe
   - devuelve una función que espera a que termine la traducción pendiente (úsala al guardar) */
export function enlazarTraduccion(inpEs, inpEn, alCambiar) {
  if (!inpEs || !inpEn) return async () => {};
  let timer = null, pendiente = Promise.resolve(), ultimo = inpEs.value.trim();
  /* vacío, o igual al español (nunca se tradujo) → se considera automático */
  if (!inpEn.value.trim() || inpEn.value.trim() === inpEs.value.trim()) inpEn.dataset.auto = "1";
  const marcar = v => { inpEn.classList.toggle("auto-traducido", v); inpEn.title = v ? "Traducido automáticamente · puedes corregirlo" : ""; };
  const correr = () => {
    const texto = inpEs.value.trim();
    if (inpEn.dataset.auto !== "1" || (texto === ultimo && inpEn.value && inpEn.value.trim() !== texto)) return pendiente;
    ultimo = texto;
    if (!texto) { inpEn.value = ""; marcar(false); return pendiente; }
    inpEn.classList.add("traduciendo");
    pendiente = traducir(texto).then(tr => {
      inpEn.classList.remove("traduciendo");
      if (inpEn.dataset.auto === "1" && inpEs.value.trim() === texto) { inpEn.value = tr; marcar(true); alCambiar?.(tr); }
    });
    return pendiente;
  };
  inpEs.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(correr, 450); });
  inpEs.addEventListener("change", () => { clearTimeout(timer); correr(); });
  inpEn.addEventListener("input", () => { inpEn.dataset.auto = inpEn.value.trim() ? "0" : "1"; marcar(false); });
  return async () => { clearTimeout(timer); await correr(); return inpEn.value.trim(); };
}

/* Traduce una lista de textos con pocas peticiones simultáneas */
export async function traducirVarios(textos, simultaneas = 4) {
  const out = new Array(textos.length); let i = 0;
  await Promise.all(Array.from({ length: simultaneas }, async () => { while (i < textos.length) { const k = i++; out[k] = await traducir(textos[k]); } }));
  return out;
}
