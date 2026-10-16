
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 5,
  duration: '20s',

  thresholds: {
    http_req_duration: ['p(95)<0.01'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const respuesta = http.get(`${BASE_URL}/api/productos`);

  check(respuesta, {
    'Catalogo responde HTTP 200': (r) => r.status === 200,
    'Catalogo devuelve productos': (r) => {
      try {
        const productos = r.json();
        return Array.isArray(productos) && productos.length >= 20;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
