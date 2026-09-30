/* ============================================================
   LEITIME · Catálogo y configuración por defecto
   ------------------------------------------------------------
   Este archivo es la "fuente" de la tienda. El panel (admin.html)
   guarda los cambios en el navegador y puede descargar una copia
   nueva de este archivo para publicarla en el servidor.
   ============================================================ */
window.LEITIME_DEFAULT = {
  version: 2,
  config: {
    nombre: "LEITIME",
    lema: { es: "Tu mercado, a tu puerta.", en: "Your market, at your door." },
    whatsapp: "51999999999",
    moneda: "S/",
    delivery: 5,
    metaYapa: 30,
    horaAbre: 6,
    horaCierra: 18,
    dias: [1, 2, 3, 4, 5],
    direccion: { es: "Puesto 24 · Mercado Central", en: "Stall 24 · Central Market" },
    pagos: "Yape · Plin · Efectivo",
    pin: "1234"
  },
  categorias: [
    { id: "frutas",    es: "Frutas",    en: "Fruit" },
    { id: "verduras",  es: "Verduras",  en: "Vegetables" },
    { id: "carnes",    es: "Carnes",    en: "Meat & Poultry" },
    { id: "abarrotes", es: "Abarrotes", en: "Pantry" }
  ],
  unidades: [
    { id: "kg",      es: "kg",      en: "kg" },
    { id: "unidad",  es: "unidad",  en: "each" },
    { id: "atado",   es: "atado",   en: "bunch" },
    { id: "paquete", es: "paquete", en: "pack" },
    { id: "docena",  es: "docena",  en: "dozen" },
    { id: "litro",   es: "litro",   en: "liter" }
  ],
  productos: [
    { id: "palta",     es: "Palta fuerte",        en: "Fuerte avocado",     cat: "frutas",    icono: "🥑", precio: 8.90,  unidad: "kg",      antes: 10.50, visible: true },
    { id: "platano",   es: "Plátano de seda",     en: "Banana",             cat: "frutas",    icono: "🍌", precio: 3.50,  unidad: "kg",      antes: null,  visible: true },
    { id: "manzana",   es: "Manzana Israel",      en: "Israel apple",       cat: "frutas",    icono: "🍎", precio: 6.00,  unidad: "kg",      antes: null,  visible: true },
    { id: "pina",      es: "Piña golden",         en: "Golden pineapple",   cat: "frutas",    icono: "🍍", precio: 5.00,  unidad: "unidad",  antes: null,  visible: true },
    { id: "mango",     es: "Mango Kent",          en: "Kent mango",         cat: "frutas",    icono: "🥭", precio: 4.50,  unidad: "kg",      antes: 6.00,  visible: true },
    { id: "fresa",     es: "Fresas",              en: "Strawberries",       cat: "frutas",    icono: "🍓", precio: 7.00,  unidad: "kg",      antes: null,  visible: true },
    { id: "limon",     es: "Limón",               en: "Lime",               cat: "frutas",    icono: "🍋", precio: 4.00,  unidad: "kg",      antes: null,  visible: true },
    { id: "tomate",    es: "Tomate",              en: "Tomato",             cat: "verduras",  icono: "🍅", precio: 3.80,  unidad: "kg",      antes: null,  visible: true },
    { id: "papa",      es: "Papa amarilla",       en: "Yellow potato",      cat: "verduras",  icono: "🥔", precio: 4.20,  unidad: "kg",      antes: 5.00,  visible: true },
    { id: "cebolla",   es: "Cebolla roja",        en: "Red onion",          cat: "verduras",  icono: "🧅", precio: 2.90,  unidad: "kg",      antes: null,  visible: true },
    { id: "zanahoria", es: "Zanahoria",           en: "Carrot",             cat: "verduras",  icono: "🥕", precio: 2.50,  unidad: "kg",      antes: null,  visible: true },
    { id: "choclo",    es: "Choclo serrano",      en: "Andean corn",        cat: "verduras",  icono: "🌽", precio: 2.00,  unidad: "unidad",  antes: null,  visible: true },
    { id: "brocoli",   es: "Brócoli",             en: "Broccoli",           cat: "verduras",  icono: "🥦", precio: 5.50,  unidad: "kg",      antes: null,  visible: true },
    { id: "culantro",  es: "Culantro",            en: "Cilantro",           cat: "verduras",  icono: "🌿", precio: 1.00,  unidad: "atado",   antes: null,  visible: true },
    { id: "aji",       es: "Ají amarillo",        en: "Yellow chili",       cat: "verduras",  icono: "🌶️", precio: 6.50,  unidad: "kg",      antes: null,  visible: true },
    { id: "pollo",     es: "Pollo entero",        en: "Whole chicken",      cat: "carnes",    icono: "🍗", precio: 10.90, unidad: "kg",      antes: 12.50, visible: true },
    { id: "pecho",     es: "Pecho de pollo",      en: "Chicken breast",     cat: "carnes",    icono: "🍗", precio: 14.50, unidad: "kg",      antes: null,  visible: true },
    { id: "res",       es: "Bistec de res",       en: "Beef steak",         cat: "carnes",    icono: "🥩", precio: 32.00, unidad: "kg",      antes: null,  visible: true },
    { id: "chuleta",   es: "Chuleta de cerdo",    en: "Pork chop",          cat: "carnes",    icono: "🥓", precio: 22.00, unidad: "kg",      antes: null,  visible: true },
    { id: "huevo",     es: "Huevos",              en: "Eggs",               cat: "abarrotes", icono: "🥚", precio: 8.50,  unidad: "kg",      antes: null,  visible: true },
    { id: "arroz",     es: "Arroz extra",         en: "Extra rice",         cat: "abarrotes", icono: "🍚", precio: 4.30,  unidad: "kg",      antes: null,  visible: true },
    { id: "azucar",    es: "Azúcar rubia",        en: "Brown sugar",        cat: "abarrotes", icono: "🧂", precio: 3.90,  unidad: "kg",      antes: null,  visible: true },
    { id: "aceite",    es: "Aceite vegetal 1 L",  en: "Vegetable oil 1 L",  cat: "abarrotes", icono: "🫗", precio: 9.80,  unidad: "unidad",  antes: 11.00, visible: true },
    { id: "fideos",    es: "Fideos tallarín",     en: "Spaghetti",          cat: "abarrotes", icono: "🍝", precio: 3.60,  unidad: "paquete", antes: null,  visible: true }
  ]
};
