
/**
 * RETO 5 - QA CLOUD-NATIVE
 * Fase 2: Smoke Tests de la API.
 *
 * Ejecutar:
 *   node pipeline/smoke-tests.js
 *
 * Requiere que la aplicacion este iniciada.
 *
 * BASE_URL permite ejecutar las pruebas
 * en diferentes ambientes.
 */

import assert from 'node:assert/strict';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let pruebasExitosas = 0;
let pruebasFallidas = 0;

// Ejecuta una prueba y registra su resultado.
async function ejecutarPrueba(nombre, prueba) {
  try {
    await prueba();
    pruebasExitosas++;
    console.log(`PASS - ${nombre}`);
  } catch (error) {
    pruebasFallidas++;
    console.error(`FAIL - ${nombre}`);
    console.error(error.message);
  }
}

// =====================================================
// SMOKE 1 - HEALTH
// =====================================================

await ejecutarPrueba('Health API', async () => {
  const respuesta = await fetch(`${BASE_URL}/api/health`);

  assert.equal(respuesta.status, 200);

  const datos = await respuesta.json();

  assert.equal(datos.estado, 'ok');
  assert.equal(datos.servicio, 'app-tienda');
});

// =====================================================
// SMOKE 2 - CATALOGO
// =====================================================

await ejecutarPrueba('Catalogo de productos', async () => {
  const respuesta = await fetch(`${BASE_URL}/api/productos`);

  assert.equal(respuesta.status, 200);

  const productos = await respuesta.json();

  assert.ok(Array.isArray(productos));
  assert.ok(productos.length >= 20);

  const categorias = new Set(
    productos.map(producto => producto.categoria)
  );

  assert.ok(categorias.size >= 4);
});

// =====================================================
// SMOKE 3 - CREAR PEDIDO
// =====================================================

await ejecutarPrueba('Crear pedido', async () => {
  const respuesta = await fetch(`${BASE_URL}/api/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productoId: 1,
      cliente: 'qa.automatizacion@example.com',
      cantidad: 1
    })
  });

  assert.equal(respuesta.status, 201);

  const pedido = await respuesta.json();

  assert.ok(Number.isInteger(pedido.id));
  assert.equal(pedido.productoId, 1);
  assert.equal(pedido.cantidad, 1);
  assert.equal(pedido.estado, 'pendiente');
});

// =====================================================
// RESUMEN
// =====================================================

console.log('\n================================');
console.log('RESULTADO SMOKE TESTS');
console.log('================================');
console.log(`Exitosas: ${pruebasExitosas}`);
console.log(`Fallidas: ${pruebasFallidas}`);
console.log('================================');

if (pruebasFallidas > 0) {
  process.exitCode = 1;
}
