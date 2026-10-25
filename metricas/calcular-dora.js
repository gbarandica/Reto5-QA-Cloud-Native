const fs = require("node:fs");
const path = require("node:path");

const ARCHIVO_DATOS = path.join(__dirname, "deployments.json");

function convertirFecha(valor, campo, id) {
  const fecha = Date.parse(valor);

  if (typeof valor !== "string" || !Number.isFinite(fecha)) {
    throw new Error(`Despliegue ${id}: fecha invalida en ${campo}`);
  }

  return fecha;
}

function calcularDora(registros) {
  if (!Array.isArray(registros) || registros.length === 0) {
    throw new Error("Se requiere al menos un despliegue.");
  }

  const despliegues = registros.map((registro, indice) => {
    const id = registro.id ?? `registro-${indice + 1}`;
    const committedAt = convertirFecha(registro.committed_at, "committed_at", id);
    const deployedAt = convertirFecha(registro.deployed_at, "deployed_at", id);

    if (deployedAt < committedAt) {
      throw new Error(`Despliegue ${id}: deployed_at es anterior al commit.`);
    }

    if (typeof registro.failed !== "boolean") {
      throw new Error(`Despliegue ${id}: failed debe ser booleano.`);
    }

    let recuperacionMs = null;

    if (registro.failed) {
      const failedAt = convertirFecha(registro.failed_at, "failed_at", id);
      const restoredAt = convertirFecha(registro.restored_at, "restored_at", id);

      if (failedAt < deployedAt || restoredAt < failedAt) {
        throw new Error(`Despliegue ${id}: fechas de incidente inconsistentes.`);
      }

      recuperacionMs = restoredAt - failedAt;
    }

    return {
      id,
      committedAt,
      deployedAt,
      failed: registro.failed,
      recuperacionMs,
    };
  });

  const MILISEGUNDOS_HORA = 60 * 60 * 1000;
  const MILISEGUNDOS_DIA = 24 * MILISEGUNDOS_HORA;

  const fechasDespliegue = despliegues.map((d) => d.deployedAt);
  const inicio = Math.min(...fechasDespliegue);
  const fin = Math.max(...fechasDespliegue);

  // La ventana de observacion se configura externamente cuando
  // se dispone de un periodo definido. De lo contrario se utiliza
  // el intervalo entre el primer y ultimo despliegue.
  const ventanaDias = Math.max(
    (fin - inicio) / MILISEGUNDOS_DIA,
    1
  );

  const frecuencia = despliegues.length / ventanaDias;

  const sumaLeadTime = despliegues.reduce(
    (total, d) => total + (d.deployedAt - d.committedAt),
    0
  );

  const leadTimeHoras =
    sumaLeadTime / despliegues.length / MILISEGUNDOS_HORA;

  const fallidos = despliegues.filter((d) => d.failed);

  const tasaFallos = (fallidos.length / despliegues.length) * 100;

  const mttrHoras = fallidos.length
    ? fallidos.reduce((total, d) => total + d.recuperacionMs, 0) /
      fallidos.length /
      MILISEGUNDOS_HORA
    : null;

  return {
    totalDespliegues: despliegues.length,
    ventanaDias: Number(ventanaDias.toFixed(2)),
    frecuenciaDespliegue: Number(frecuencia.toFixed(2)),
    leadTimeHoras: Number(leadTimeHoras.toFixed(2)),
    changeFailureRate: Number(tasaFallos.toFixed(2)),
    mttrHoras: mttrHoras === null ? null : Number(mttrHoras.toFixed(2)),
    incidentes: fallidos.length,
  };
}

function ejecutar() {
  try {
    const contenido = fs.readFileSync(ARCHIVO_DATOS, "utf8");
    const registros = JSON.parse(contenido);
    const resultado = calcularDora(registros);

    console.log("\n========================================");
    console.log("  METRICAS DORA - RETO 5 QA CLOUD-NATIVE");
    console.log("========================================");
    console.log(`Despliegues simulados : ${resultado.totalDespliegues}`);
    console.log(`Ventana observada     : ${resultado.ventanaDias} dias`);
    console.log(`Deployment Frequency  : ${resultado.frecuenciaDespliegue} deploys/dia`);
    console.log(`Lead Time for Changes : ${resultado.leadTimeHoras} horas`);
    console.log(`Change Failure Rate   : ${resultado.changeFailureRate}%`);
    console.log(
      `MTTR                  : ${
        resultado.mttrHoras === null
          ? "No calculable (sin incidentes)"
          : `${resultado.mttrHoras} horas`
      }`
    );
    console.log("========================================\n");
    console.log("IMPORTANTE: Despliegues simulados para fines academicos.\n");
  } catch (error) {
    console.error(`ERROR al calcular DORA: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  ejecutar();
}

module.exports = { calcularDora };