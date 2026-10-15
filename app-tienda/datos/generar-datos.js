
/**
 * RETO 5 - QA CLOUD-NATIVE
 * Fase 1: Generacion de datos sinteticos con Faker.
 *
 * Objetivo:
 * Generar datos reproducibles y comercialmente coherentes
 * para las pruebas automatizadas de la tienda.
 *
 * Produce:
 *   datos/db.json
 *
 * Estructura:
 *   {
 *     "productos": [...],
 *     "pedidos": [...]
 *   }
 *
 * Requisitos:
 * - Minimo 20 productos.
 * - Minimo 4 categorias.
 * - Nombre, categoria, descripcion, precio y stock.
 * - Semilla fija para reproducibilidad.
 * - Casos de borde para pruebas negativas.
 *
 * Ejecucion desde app-tienda:
 *   npm run generar
 *   node datos/generar-datos.js
 *
 * IMPORTANTE:
 * db.json no se versiona en Git.
 * Se regenera automaticamente mediante Faker.
 */

import { faker } from '@faker-js/faker';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// =====================================================
// 1. CONFIGURACION DE RUTAS
// =====================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rutaDb = path.join(__dirname, 'db.json');

// =====================================================
// 2. CONFIGURACION DE FAKER
// =====================================================

// Semilla fija para obtener datos reproducibles.
faker.seed(2025);

// Fecha de referencia fija para evitar variaciones
// entre ejecuciones realizadas en diferentes dias.
faker.setDefaultRefDate('2026-01-01T00:00:00.000Z');

// =====================================================
// 3. CONSTANTES DEL NEGOCIO
// =====================================================

const CATEGORIAS = [
  'electronica',
  'muebles',
  'hogar',
  'ropa',
  'deportes'
];

const ESTADOS = [
  'pendiente',
  'procesando',
  'enviado',
  'entregado',
  'cancelado'
];

const CANT_PRODUCTOS = 25;
const CANT_PEDIDOS = 6;

// =====================================================
// 4. CATALOGO DE PRODUCTOS POR CATEGORIA
// =====================================================

// Los nombres son controlados para garantizar
// coherencia entre el producto y su categoria.
//
// Faker se utiliza para generar los demas atributos
// variables: descripcion, precio, stock y pedidos.

const PRODUCTOS_POR_CATEGORIA = {
  electronica: [
    'Computador portatil',
    'Monitor LED',
    'Teclado mecanico',
    'Mouse inalambrico',
    'Audifonos Bluetooth'
  ],

  muebles: [
    'Escritorio de oficina',
    'Silla ergonomica',
    'Mesa de comedor',
    'Biblioteca de madera',
    'Sofa de tres puestos'
  ],

  hogar: [
    'Juego de sabanas',
    'Lampara de mesa',
    'Organizador de cocina',
    'Cortina decorativa',
    'Juego de toallas'
  ],

  ropa: [
    'Camiseta deportiva',
    'Pantalon jean',
    'Chaqueta impermeable',
    'Zapatos casuales',
    'Sudadera de algodon'
  ],

  deportes: [
    'Balon de futbol',
    'Mancuernas ajustables',
    'Colchoneta de yoga',
    'Banda de resistencia',
    'Raqueta de tenis'
  ]
};

// =====================================================
// 5. GENERACION DE PRODUCTOS
// =====================================================

const DESCRIPCIONES_POR_CATEGORIA = {
  electronica: 'Dispositivo electronico diseñado para uso personal y profesional.',
  muebles: 'Mueble funcional para mejorar la comodidad y organizacion de espacios.',
  hogar: 'Articulo practico para el equipamiento y comodidad del hogar.',
  ropa: 'Prenda de vestir comoda y versatil para uso cotidiano.',
  deportes: 'Articulo deportivo diseñado para entrenamiento y actividad fisica.'
};

function crearProducto(id) {

  // Distribucion ciclica entre las cinco categorias.
  const categoria = CATEGORIAS[
    (id - 1) % CATEGORIAS.length
  ];

  // Seleccion del nombre correspondiente.
  const indiceProducto = Math.floor(
    (id - 1) / CATEGORIAS.length
  );

  const nombres = PRODUCTOS_POR_CATEGORIA[categoria];

  // El modulo permite reutilizar el catalogo si
  // posteriormente aumentamos la cantidad de productos.
  const nombre = nombres[indiceProducto % nombres.length];

  return {
    id,
    nombre,
    categoria,
    descripcion: DESCRIPCIONES_POR_CATEGORIA[categoria],

    precio: Number(
      faker.commerce.price({
        min: 20,
        max: 2500,
        dec: 2
      })
    ),

    stock: faker.number.int({
      min: 1,
      max: 80
    }),

    activo: true
  };
}

// Generar los 25 productos.
const productos = Array.from(
  { length: CANT_PRODUCTOS },
  (_, i) => crearProducto(i + 1)
);

// =====================================================
// 6. CASOS DE BORDE
// =====================================================

// Ultimo producto inactivo y sin inventario.
//
// Permite validar:
// - Productos inactivos.
// - Restricciones de inventario.
// - Comportamiento del catalogo.
// - Escenarios negativos de compra.

const productoSinStock = productos[productos.length - 1];

productoSinStock.activo = false;
productoSinStock.stock = 0;

// =====================================================
// 7. GENERACION DE PEDIDOS
// =====================================================

function crearPedido(id) {

  return {
    id,

    productoId: faker.number.int({
      min: 1,
      max: CANT_PRODUCTOS
    }),

    cliente: faker.internet.email().toLowerCase(),

    cantidad: faker.number.int({
      min: 1,
      max: 5
    }),

    estado: faker.helpers.arrayElement(ESTADOS),

    fecha: faker.date.recent({
      days: 30
    }).toISOString().slice(0, 10)
  };
}

// Generar los pedidos.
const pedidos = Array.from(
  { length: CANT_PEDIDOS },
  (_, i) => crearPedido(i + 1)
);

// =====================================================
// 8. CONSTRUCCION DE LA BASE DE DATOS
// =====================================================

const db = {
  productos,
  pedidos
};

// Garantizar que exista la carpeta de destino.
fs.mkdirSync(
  path.dirname(rutaDb),
  { recursive: true }
);

// Guardar el archivo JSON.
fs.writeFileSync(
  rutaDb,
  JSON.stringify(db, null, 2),
  'utf8'
);

// =====================================================
// 9. RESUMEN DE GENERACION
// =====================================================

const categoriasGeneradas = [
  ...new Set(productos.map(p => p.categoria))
];

console.log('==============================================');
console.log(' RETO 5 - GENERACION DE DATOS CON FAKER');
console.log('==============================================');

console.log('Semilla Faker: 2025');
console.log('Productos generados: ' + productos.length);
console.log('Categorias generadas: ' + categoriasGeneradas.length);
console.log('Pedidos generados: ' + pedidos.length);

console.log('Categorias: ' + categoriasGeneradas.join(', '));

console.log('Caso de borde: producto ' +
  productoSinStock.id +
  ' inactivo y sin stock.'
);

console.log('Ejemplo: ' +
  productos[0].nombre +
  ' (' + productos[0].categoria + ')' +
  ' $' + productos[0].precio
);

console.log('Archivo generado: datos/db.json');
console.log('==============================================');
