
const fs = require("node:fs");
const path = require("node:path");

const ORGANIZACION = "gbarandica";
const PROYECTO = "QA-Cloud-Native";
const PIPELINE_ID = 1;

const ETAPAS_OBLIGATORIAS = [
  "Build",
  "SmokeTests",
  "ContractTests",
  "LoadTest",
  "E2ETests",
  "CloudTests"
];

// 1. Consultar el historial de ejecuciones de Azure DevOps.
async function obtenerEjecuciones() {
  const token = process.env.SYSTEM_ACCESSTOKEN;

  if (!token) {
    throw new Error(
      "No se encontró SYSTEM_ACCESSTOKEN. " +
      "Este adaptador debe ejecutarse desde Azure Pipelines."
    );
  }

  const url = new URL(
    `https://dev.azure.com/${ORGANIZACION}/${PROYECTO}/_apis/build/builds`
  );

  url.searchParams.set("definitions", String(PIPELINE_ID));
  url.searchParams.set("$top", "100");
  url.searchParams.set("api-version", "7.1");

  const respuesta = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    },
    redirect: "manual"
  });

  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar Azure DevOps: HTTP ${respuesta.status}`
    );
  }

  const datos = await respuesta.json();

  if (!Array.isArray(datos.value)) {
    throw new Error(
      "Azure DevOps no devolvió una lista válida de ejecuciones."
    );
  }

  return datos.value;
}

// 2. Consultar las etapas de una ejecución mediante su Timeline.
async function obtenerTimeline(buildId) {
  const token = process.env.SYSTEM_ACCESSTOKEN;

  if (!token) {
    throw new Error(
      "No se encontró SYSTEM_ACCESSTOKEN para consultar el Timeline."
    );
  }

  if (
    !Number.isSafeInteger(Number(buildId)) ||
    Number(buildId) <= 0
  ) {
    throw new Error(
      `Identificador de build inválido: ${buildId}`
    );
  }

  const url = new URL(
    `https://dev.azure.com/${ORGANIZACION}/${PROYECTO}/_apis/build/builds/${buildId}/timeline`
  );

  url.searchParams.set("api-version", "7.1");

  const respuesta = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    },
    redirect: "manual"
  });

  if (!respuesta.ok) {
    throw new Error(
      `Error al consultar Timeline del build ${buildId}: HTTP ${respuesta.status}`
    );
  }

  const datos = await respuesta.json();

  if (!Array.isArray(datos.records)) {
    throw new Error(
      `Timeline inválido para el build ${buildId}`
    );
  }

  return datos.records;
}

// 3. Verificar que las seis etapas obligatorias sean exitosas.
function tieneEtapasObligatorias(registros) {
  if (!Array.isArray(registros)) {
    throw new Error(
      "Los registros del Timeline deben ser una lista."
    );
  }

  const etapasExitosas = new Set(
    registros
      .filter(
        (registro) =>
          registro.type === "Stage" &&
          registro.state === "completed" &&
          registro.result === "succeeded"
      )
      .map((registro) => registro.name)
  );

  return ETAPAS_OBLIGATORIAS.every(
    (etapa) => etapasExitosas.has(etapa)
  );
}

// 4. Convertir ejecuciones exitosas en despliegues simulados.
function transformarEjecuciones(ejecuciones) {
  return ejecuciones
    .filter(
      (ejecucion) =>
        ejecucion.status === "completed" &&
        ejecucion.result === "succeeded" &&
        ejecucion.finishTime
    )
    .map((ejecucion) => ({
      id: String(ejecucion.id),
      commit: ejecucion.sourceVersion,
      deployed_at: ejecucion.finishTime,
      simulated: true,
      source: "azure-devops",
      failed: false
    }));
}

// 5. Obtener desde GitHub la fecha real de un commit.
async function obtenerFechaCommit(sha) {
  if (!/^[a-f0-9]{40}$/i.test(sha)) {
    throw new Error(
      `SHA de commit inválido: ${sha}`
    );
  }

  const url =
    `https://api.github.com/repos/gbarandica/Reto5-QA-Cloud-Native/commits/${sha}`;

  const respuesta = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "Reto5-DORA-Metrics"
    },
    redirect: "manual"
  });

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo consultar el commit ${sha}: HTTP ${respuesta.status}`
    );
  }

  const datos = await respuesta.json();
  const fecha = datos.commit?.committer?.date;

  if (!fecha || Number.isNaN(Date.parse(fecha))) {
    throw new Error(
      `El commit ${sha} no tiene una fecha válida`
    );
  }

  return fecha;
}

// 6. Incorporar committed_at a cada despliegue simulado.
async function enriquecerDespliegues(
  despliegues,
  consultarFecha = obtenerFechaCommit
) {
  const resultado = [];
  const fechasPorCommit = new Map();

  for (const despliegue of despliegues) {
    const sha = despliegue.commit;

    if (!fechasPorCommit.has(sha)) {
      const fecha = await consultarFecha(sha);
      fechasPorCommit.set(sha, fecha);
    }

    const committedAt = fechasPorCommit.get(sha);

    if (
      !committedAt ||
      Number.isNaN(Date.parse(committedAt))
    ) {
      throw new Error(
        `Fecha de commit inválida para la ejecución ${despliegue.id}`
      );
    }

    if (
      Date.parse(committedAt) >
      Date.parse(despliegue.deployed_at)
    ) {
      throw new Error(
        `La fecha del commit es posterior a la ejecución ${despliegue.id}`
      );
    }

    resultado.push({
      ...despliegue,
      committed_at: committedAt
    });
  }

  return resultado;
}

// 7. Orquestar la consulta, validación y generación del JSON.
async function main() {
  // Consultar el historial de ejecuciones.
  const ejecuciones = await obtenerEjecuciones();

  // Seleccionar ejecuciones finalizadas exitosamente.
  const candidatos = transformarEjecuciones(ejecuciones);

  // Verificar las seis etapas obligatorias de cada ejecución.
  const desplieguesElegibles = [];

  for (const candidato of candidatos) {
    const registrosTimeline = await obtenerTimeline(
      candidato.id
    );

    if (tieneEtapasObligatorias(registrosTimeline)) {
      desplieguesElegibles.push(candidato);

      console.log(
        `Build ${candidato.id}: elegible (6 etapas exitosas)`
      );
    } else {
      console.log(
        `Build ${candidato.id}: excluido (etapas incompletas)`
      );
    }
  }

  // Evitar generar métricas cuando no hay datos elegibles.
  if (desplieguesElegibles.length === 0) {
    throw new Error(
      "No se encontraron ejecuciones con las seis etapas exitosas."
    );
  }

  // Obtener las fechas de los commits desde GitHub.
  const desplieguesCompletos = await enriquecerDespliegues(
    desplieguesElegibles
  );

  // Generar el archivo de datos DORA.
  const destino = path.join(
    __dirname,
    "..",
    "deployments.json"
  );

  fs.writeFileSync(
    destino,
    JSON.stringify(desplieguesCompletos, null, 2) + "\n",
    "utf8"
  );

  // Mostrar el resumen del procesamiento.
  console.log("========================================");
  console.log("RESUMEN DE EJECUCIONES DORA");
  console.log("========================================");

  console.log(
    `Ejecuciones consultadas: ${ejecuciones.length}`
  );

  console.log(
    `Candidatos exitosos: ${candidatos.length}`
  );

  console.log(
    `Despliegues simulados elegibles: ${desplieguesCompletos.length}`
  );

  console.log(
    `Ejecuciones excluidas: ${
      candidatos.length - desplieguesCompletos.length
    }`
  );

  console.log(
    `Archivo generado: ${destino}`
  );
}

// Ejecutar main solamente cuando se invoca directamente.
if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

// Exportar funciones para reutilización y pruebas automatizadas.
module.exports = {
  obtenerEjecuciones,
  obtenerTimeline,
  tieneEtapasObligatorias,
  transformarEjecuciones,
  obtenerFechaCommit,
  enriquecerDespliegues
};
