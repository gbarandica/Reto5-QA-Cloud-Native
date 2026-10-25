
const test = require("node:test");
const assert = require("node:assert/strict");

const { calcularDora } = require("../calcular-dora");

test("calcula frecuencia, lead time y CFR con datos conocidos", () => {
  const registros = [
    {
      id: "101",
      committed_at: "2026-10-20T08:00:00Z",
      deployed_at: "2026-10-20T10:00:00Z",
      failed: false
    },
    {
      id: "102",
      committed_at: "2026-10-21T08:00:00Z",
      deployed_at: "2026-10-21T12:00:00Z",
      failed: true,
      failed_at: "2026-10-21T13:00:00Z",
      restored_at: "2026-10-21T14:30:00Z"
    }
  ];

  const resultado = calcularDora(registros);

  assert.equal(resultado.totalDespliegues, 2);
  assert.equal(resultado.frecuenciaDespliegue, 1.85);
  assert.equal(resultado.leadTimeHoras, 3);
  assert.equal(resultado.changeFailureRate, 50);
  assert.equal(resultado.mttrHoras, 1.5);
  assert.equal(resultado.incidentes, 1);
});

test("no calcula MTTR cuando no hay incidentes", () => {
  const registros = [
    {
      id: "103",
      committed_at: "2026-10-24T08:00:00Z",
      deployed_at: "2026-10-24T09:00:00Z",
      failed: false
    }
  ];

  const resultado = calcularDora(registros);

  assert.equal(resultado.mttrHoras, null);
  assert.equal(resultado.incidentes, 0);
});

test("rechaza fechas de despliegue anteriores al commit", () => {
  const registros = [
    {
      id: "104",
      committed_at: "2026-10-24T12:00:00Z",
      deployed_at: "2026-10-24T10:00:00Z",
      failed: false
    }
  ];

  assert.throws(
    () => calcularDora(registros),
    /deployed_at es anterior al commit/
  );
});

test("rechaza incidentes con fechas inconsistentes", () => {
  const registros = [
    {
      id: "105",
      committed_at: "2026-10-24T08:00:00Z",
      deployed_at: "2026-10-24T09:00:00Z",
      failed: true,
      failed_at: "2026-10-24T11:00:00Z",
      restored_at: "2026-10-24T10:00:00Z"
    }
  ];

  assert.throws(
    () => calcularDora(registros),
    /fechas de incidente inconsistentes/
  );
});
