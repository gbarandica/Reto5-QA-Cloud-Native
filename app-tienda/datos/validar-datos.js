import fs from 'node:fs';

const db = JSON.parse(
  fs.readFileSync('datos/db.json', 'utf8')
);

const categorias = [
  ...new Set(db.productos.map(p => p.categoria))
];

const productosValidos = db.productos.every(p =>
  typeof p.nombre === 'string' &&
  p.nombre.trim().length > 0 &&
  Number.isFinite(p.precio) &&
  p.precio > 0 &&
  Number.isInteger(p.stock) &&
  p.stock >= 0 &&
  typeof p.categoria === 'string'
);

const cumpleRequisitos =
  db.productos.length >= 20 &&
  categorias.length >= 4 &&
  productosValidos;

console.log('===== Validación de datos Faker =====');
console.log('Productos:', db.productos.length);
console.log('Categorías:', categorias.join(', '));
console.log('Cantidad de categorías:', categorias.length);
console.log('Pedidos:', db.pedidos.length);
console.log('Datos de productos válidos:', productosValidos);
console.log('Cumple requisitos:', cumpleRequisitos);

if (!cumpleRequisitos) {
  console.error('ERROR: Los datos no cumplen los requisitos.');
  process.exit(1);
}

console.log('VALIDACIÓN EXITOSA');