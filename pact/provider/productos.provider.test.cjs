
const path = require('node:path');
const { Verifier } = require('@pact-foundation/pact');

// API real ejecutándose en nuestro contenedor Docker.
const PROVIDER_URL = process.env.PROVIDER_URL || 'http://localhost:3000';

// Archivo generado por la prueba del consumidor.
const CONTRACT_PATH = path.resolve(
  __dirname,
  '../contracts/TiendaQAFrontend-TiendaQAAPI.json'
);

async function verificarProveedor() {
  const verifier = new Verifier({
    provider: 'TiendaQAAPI',
    providerBaseUrl: PROVIDER_URL,

    // Contrato que debe cumplir nuestra API.
    pactUrls: [CONTRACT_PATH],

    // Estados necesarios para verificar ambos contratos.
    stateHandlers: {

      // ============================================
      // ESTADO 1: CATALOGO DE PRODUCTOS
      // ============================================
      'existen productos disponibles en el catalogo': async () => {
        const respuesta = await fetch(`${PROVIDER_URL}/api/productos`);

        if (!respuesta.ok) {
          throw new Error(
            `No se pudo consultar el catalogo: HTTP ${respuesta.status}`
          );
        }

        const productos = await respuesta.json();

        if (!Array.isArray(productos) || productos.length === 0) {
          throw new Error('El catalogo no contiene productos');
        }
      },

      // ============================================
      // ESTADO 2: DETALLE DEL PRODUCTO
      // ============================================
      'existe el producto con id 1': async () => {
        const respuesta = await fetch(`${PROVIDER_URL}/api/productos/1`);

        if (!respuesta.ok) {
          throw new Error(
            `No existe el producto con id 1: HTTP ${respuesta.status}`
          );
        }

        const producto = await respuesta.json();

        if (producto.id !== 1) {
          throw new Error(
            'El producto consultado no tiene el id esperado'
          );
        }
      },
    },
  });

  // Verificar ambos contratos contra la API real.
  await verifier.verifyProvider();

  console.log('El proveedor cumple los contratos Pact.');
}

verificarProveedor().catch((error) => {
  console.error('La verificacion del proveedor fallo:', error);
  process.exitCode = 1;
});

