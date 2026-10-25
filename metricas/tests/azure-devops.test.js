
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  transformarEjecuciones,
  enriquecerDespliegues,
  tieneEtapasObligatorias
} = require("../adaptadores/azure-devops");

test("incluye ejecuciones exitosas como despliegues simulados", () => {
  const ejecuciones = [
    {
      id: 101,
      status: "completed",
      result: "succeeded",
      sourceVersion: "abc123",
      finishTime: "2026-10-24T12:00:00Z"
    }
  ];

  const resultado = transformarEjecuciones(ejecuciones);

  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].id, "101");
  assert.equal(resultado[0].commit, "abc123");
  assert.equal(resultado[0].simulated, true);
  assert.equal(resultado[0].failed, false);
});

test("excluye ejecuciones fallidas del despliegue simulado", () => {
  const ejecuciones = [
    {
      id: 102,
      status: "completed",
      result: "failed",
      sourceVersion: "def456",
      finishTime: "2026-10-24T13:00:00Z"
    }
  ];

  const resultado = transformarEjecuciones(ejecuciones);

  assert.equal(resultado.length, 0);
});

test("excluye ejecuciones que todavía están en progreso", () => {
  const ejecuciones = [
    {
      id: 103,
      status: "inProgress",
      result: null,
      sourceVersion: "ghi789",
      finishTime: null
    }
  ];

  const resultado = transformarEjecuciones(ejecuciones);

  assert.equal(resultado.length, 0);
});


test("agrega committed_at a un despliegue simulado", async () => {
  const despliegues = [
    {
      id: "101",
      commit: "abc123",
      deployed_at: "2026-10-24T12:00:00Z",
      simulated: true,
      source: "azure-devops",
      failed: false
    }
  ];

  const consultarFechaSimulada = async () =>
    "2026-10-24T11:00:00Z";

  const resultado = await enriquecerDespliegues(
    despliegues,
    consultarFechaSimulada
  );

  assert.equal(resultado.length, 1);
  assert.equal(
    resultado[0].committed_at,
    "2026-10-24T11:00:00Z"
  );
});

test("consulta una sola vez la fecha de un commit repetido", async () => {
  const despliegues = [
    {
      id: "101",
      commit: "abc123",
      deployed_at: "2026-10-24T12:00:00Z"
    },
    {
      id: "102",
      commit: "abc123",
      deployed_at: "2026-10-24T13:00:00Z"
    }
  ];

  let consultas = 0;

  const consultarFechaSimulada = async () => {
    consultas++;
    return "2026-10-24T11:00:00Z";
  };

  const resultado = await enriquecerDespliegues(
    despliegues,
    consultarFechaSimulada
  );

  assert.equal(resultado.length, 2);
  assert.equal(consultas, 1);
});

test("rechaza commits posteriores a la ejecución", async () => {
  const despliegues = [
    {
      id: "103",
      commit: "abc123",
      deployed_at: "2026-10-24T12:00:00Z"
    }
  ];

  const consultarFechaSimulada = async () =>
    "2026-10-24T14:00:00Z";

  await assert.rejects(
    enriquecerDespliegues(
      despliegues,
      consultarFechaSimulada
    ),
    /La fecha del commit es posterior/
  );
});

test("propaga errores de consulta sin generar datos parciales", async () => {
  const despliegues = [
    {
      id: "104",
      commit: "abc123",
      deployed_at: "2026-10-24T12:00:00Z"
    }
  ];

  const consultarFechaSimulada = async () => {
    throw new Error("GitHub no disponible");
  };

  await assert.rejects(
    enriquecerDespliegues(
      despliegues,
      consultarFechaSimulada
    ),
    /GitHub no disponible/
  );
});


test("acepta una ejecucion con las seis etapas exitosas", () => {
  const nombresEtapas = [
    "Build",
    "SmokeTests",
    "ContractTests",
    "LoadTest",
    "E2ETests",
    "CloudTests"
  ];

  const registros = nombresEtapas.map((nombre) => ({
    type: "Stage",
    name: nombre,
    state: "completed",
    result: "succeeded"
  }));

  const resultado = tieneEtapasObligatorias(registros);

  assert.equal(resultado, true);
});

test("rechaza una ejecucion cuando falta una etapa obligatoria", () => {
  const nombresEtapas = [
    "Build",
    "SmokeTests",
    "ContractTests",
    "LoadTest",
    "E2ETests"
  ];

  const registros = nombresEtapas.map((nombre) => ({
    type: "Stage",
    name: nombre,
    state: "completed",
    result: "succeeded"
  }));

  const resultado = tieneEtapasObligatorias(registros);

  assert.equal(resultado, false);
});

test("rechaza una ejecucion cuando una etapa ha fallado", () => {
  const nombresEtapas = [
    "Build",
    "SmokeTests",
    "ContractTests",
    "LoadTest",
    "E2ETests",
    "CloudTests"
  ];

  const registros = nombresEtapas.map((nombre) => ({
    type: "Stage",
    name: nombre,
    state: "completed",
    result: nombre === "LoadTest" ? "failed" : "succeeded"
  }));

  const resultado = tieneEtapasObligatorias(registros);

  assert.equal(resultado, false);
});
