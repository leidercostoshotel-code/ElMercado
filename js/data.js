/* ============================================================
   El Mercado de Amazonas · Catálogo de ejemplo
   ------------------------------------------------------------
   Solo se usa para "Cargar catálogo de ejemplo" desde el panel
   en un proyecto de Firebase vacío, y como textos de respaldo
   mientras la tienda todavía no tiene configuración guardada.
   Los datos reales viven en Firestore.
   ============================================================ */
export const SEMILLA = {
  config: {
    nombre: "El Mercado de Amazonas",
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
    apariencia: { primario: "#146B3A", acento: "#E2432B", resalte: "#FFC53D", fuenteTitulos: "Bricolage Grotesque", fuenteTexto: "DM Sans" }
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
    { id: "palta",     es: "Palta fuerte",        en: "Fuerte avocado",     cat: "frutas",    icono: "🥑", precio: 8.90,  unidad: "kg",      antes: 10.50, activo: true, imagen: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=480&q=70&auto=format&fit=crop" },
    { id: "platano",   es: "Plátano de seda",     en: "Banana",             cat: "frutas",    icono: "🍌", precio: 3.50,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=480&q=70&auto=format&fit=crop" },
    { id: "manzana",   es: "Manzana Israel",      en: "Israel apple",       cat: "frutas",    icono: "🍎", precio: 6.00,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=480&q=70&auto=format&fit=crop" },
    { id: "pina",      es: "Piña golden",         en: "Golden pineapple",   cat: "frutas",    icono: "🍍", precio: 5.00,  unidad: "unidad",  antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=480&q=70&auto=format&fit=crop" },
    { id: "mango",     es: "Mango Kent",          en: "Kent mango",         cat: "frutas",    icono: "🥭", precio: 4.50,  unidad: "kg",      antes: 6.00,  activo: true, imagen: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=480&q=70&auto=format&fit=crop" },
    { id: "fresa",     es: "Fresas",              en: "Strawberries",       cat: "frutas",    icono: "🍓", precio: 7.00,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=480&q=70&auto=format&fit=crop" },
    { id: "limon",     es: "Limón",               en: "Lime",               cat: "frutas",    icono: "🍋", precio: 4.00,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=480&q=70&auto=format&fit=crop" },
    { id: "tomate",    es: "Tomate",              en: "Tomato",             cat: "verduras",  icono: "🍅", precio: 3.80,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=480&q=70&auto=format&fit=crop" },
    { id: "papa",      es: "Papa amarilla",       en: "Yellow potato",      cat: "verduras",  icono: "🥔", precio: 4.20,  unidad: "kg",      antes: 5.00,  activo: true, imagen: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=480&q=70&auto=format&fit=crop" },
    { id: "cebolla",   es: "Cebolla roja",        en: "Red onion",          cat: "verduras",  icono: "🧅", precio: 2.90,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=480&q=70&auto=format&fit=crop" },
    { id: "zanahoria", es: "Zanahoria",           en: "Carrot",             cat: "verduras",  icono: "🥕", precio: 2.50,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=480&q=70&auto=format&fit=crop" },
    { id: "choclo",    es: "Choclo serrano",      en: "Andean corn",        cat: "verduras",  icono: "🌽", precio: 2.00,  unidad: "unidad",  antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=480&q=70&auto=format&fit=crop" },
    { id: "brocoli",   es: "Brócoli",             en: "Broccoli",           cat: "verduras",  icono: "🥦", precio: 5.50,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=480&q=70&auto=format&fit=crop" },
    { id: "culantro",  es: "Culantro",            en: "Cilantro",           cat: "verduras",  icono: "🌿", precio: 1.00,  unidad: "atado",   antes: null,  activo: true, imagen: "" },
    { id: "aji",       es: "Ají amarillo",        en: "Yellow chili",       cat: "verduras",  icono: "🌶️", precio: 6.50,  unidad: "kg",      antes: null,  activo: true, imagen: "" },
    { id: "pollo",     es: "Pollo entero",        en: "Whole chicken",      cat: "carnes",    icono: "🍗", precio: 10.90, unidad: "kg",      antes: 12.50, activo: true, imagen: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=480&q=70&auto=format&fit=crop" },
    { id: "pecho",     es: "Pecho de pollo",      en: "Chicken breast",     cat: "carnes",    icono: "🍗", precio: 14.50, unidad: "kg",      antes: null,  activo: true, imagen: "" },
    { id: "res",       es: "Bistec de res",       en: "Beef steak",         cat: "carnes",    icono: "🥩", precio: 32.00, unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=480&q=70&auto=format&fit=crop" },
    { id: "chuleta",   es: "Chuleta de cerdo",    en: "Pork chop",          cat: "carnes",    icono: "🥓", precio: 22.00, unidad: "kg",      antes: null,  activo: true, imagen: "" },
    { id: "huevo",     es: "Huevos",              en: "Eggs",               cat: "abarrotes", icono: "🥚", precio: 8.50,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=480&q=70&auto=format&fit=crop" },
    { id: "arroz",     es: "Arroz extra",         en: "Extra rice",         cat: "abarrotes", icono: "🍚", precio: 4.30,  unidad: "kg",      antes: null,  activo: true, imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=480&q=70&auto=format&fit=crop" },
    { id: "azucar",    es: "Azúcar rubia",        en: "Brown sugar",        cat: "abarrotes", icono: "🧂", precio: 3.90,  unidad: "kg",      antes: null,  activo: true, imagen: "" },
    { id: "aceite",    es: "Aceite vegetal 1 L",  en: "Vegetable oil 1 L",  cat: "abarrotes", icono: "🫗", precio: 9.80,  unidad: "unidad",  antes: 11.00, activo: true, imagen: "" },
    { id: "fideos",    es: "Fideos tallarín",     en: "Spaghetti",          cat: "abarrotes", icono: "🍝", precio: 3.60,  unidad: "paquete", antes: null,  activo: true, imagen: "" }
  ]
};
