
const path = require('node:path');
const assert = require('node:assert/strict');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');

const { integer, string, decimal, boolean, eachLike } = MatchersV3;

// Consumidor y proveedor del contrato.
const pact = new PactV3({
  consumer: 'TiendaQAFrontend',
  provider: 'TiendaQAAPI',
  dir: path.resolve(__dirname, '../contracts'),
});

// Estructura que el frontend necesita para mostrar productos.
const productoEsperado = {
  id: integer(1),
  nombre: string('Computador portatil'),
  categoria: string('electronica'),
  precio: decimal(356.08),
  stock: integer(36),
  activo: boolean(true),
};

async function ejecutarPrueba() {

  // ============================================
  // CONTRATO 1: CONSULTAR CATALOGO DE PRODUCTOS
  // ============================================

  pact
    .given('existen productos disponibles en el catalogo')
    .uponReceiving('una solicitud para consultar el catalogo')
    .withRequest({
      method: 'GET',
      path: '/api/productos',
    })
    .willRespondWith({
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: eachLike(productoEsperado, 1),
    });

  // ============================================
  // CONTRATO 2: CONSULTAR DETALLE DE PRODUCTO
  // ============================================

  pact
    .given('existe el producto con id 1')
    .uponReceiving('una solicitud para consultar el detalle del producto')
    .withRequest({
      method: 'GET',
      path: '/api/productos/1',
    })
    .willRespondWith({
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: integer(1),
        nombre: string('Computador portatil'),
        categoria: string('electronica'),
        descripcion: string(
          'Dispositivo electronico diseñado para uso personal y profesional.'
        ),
        precio: decimal(356.08),
        stock: integer(36),
        activo: boolean(true),
      },
    });

  // ============================================
  // EJECUTAR PRUEBAS CONTRA EL MOCK DE PACT
  // ============================================

  await pact.executeTest(async (mockServer) => {

    // PRUEBA 1: CATALOGO

    const respuesta = await fetch(
      `${mockServer.url}/api/productos`
    );

    assert.equal(respuesta.status, 200);

    const productos = await respuesta.json();

    assert.ok(Array.isArray(productos));
    assert.ok(productos.length > 0);

    const producto = productos[0];

    assert.equal(typeof producto.id, 'number');
    assert.equal(typeof producto.nombre, 'string');
    assert.equal(typeof producto.categoria, 'string');
    assert.equal(typeof producto.precio, 'number');
    assert.equal(typeof producto.stock, 'number');
    assert.equal(typeof producto.activo, 'boolean');

    console.log('Contrato del consumidor validado correctamente.');

    // PRUEBA 2: DETALLE

    const respuestaDetalle = await fetch(
      `${mockServer.url}/api/productos/1`
    );

    assert.equal(respuestaDetalle.status, 200);

    const detalle = await respuestaDetalle.json();

    assert.ok(!Array.isArray(detalle));
    assert.equal(typeof detalle.id, 'number');
    assert.equal(typeof detalle.nombre, 'string');
    assert.equal(typeof detalle.categoria, 'string');
    assert.equal(typeof detalle.descripcion, 'string');
    assert.equal(typeof detalle.precio, 'number');
    assert.equal(typeof detalle.stock, 'number');
    assert.equal(typeof detalle.activo, 'boolean');

    // Operación que utiliza el frontend real.
    assert.doesNotThrow(() => detalle.precio.toFixed(2));

    console.log('Contrato del detalle validado correctamente.');
  });
}

ejecutarPrueba().catch((error) => {
  console.error('Fallo la prueba de contrato:', error);
  process.exitCode = 1;
});

