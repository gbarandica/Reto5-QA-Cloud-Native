# Módulo de métricas DORA — Fase 6

## 1. Objetivo

Implementar un módulo académico para calcular indicadores inspirados en DORA a partir del historial de ejecuciones del pipeline de Azure DevOps.

El objetivo es analizar la frecuencia de entregas simuladas y el tiempo transcurrido entre los commits y la finalización de ejecuciones exitosas, aplicando criterios de calidad de datos.

**Importante:** el proyecto no realiza despliegues reales a producción. Las ejecuciones exitosas del pipeline se utilizan como eventos de entrega simulados.

## 2. Estructura del módulo

```text
metricas/
├── adaptadores/
│   └── azure-devops.js
├── tests/
│   ├── azure-devops.test.js
│   └── calcular-dora.test.js
├── calcular-dora.js
├── deployments.json
└── README.md
```

**Responsabilidad de cada archivo:**

- `adaptadores/azure-devops.js`: consulta el historial de Azure DevOps, verifica las etapas obligatorias y obtiene las fechas de los commits desde GitHub.
- `calcular-dora.js`: procesa los registros y calcula las métricas.
- `tests/azure-devops.test.js`: verifica la transformación, validación y enriquecimiento de los datos.
- `tests/calcular-dora.test.js`: comprueba las fórmulas y las validaciones de fechas.
- `deployments.json`: archivo generado automáticamente durante la ejecución; no se versiona en Git.
- `README.md`: documentación técnica del módulo.

## 3. Flujo de procesamiento

1. Consultar hasta 100 ejecuciones recientes del pipeline configurado en Azure DevOps.
2. Identificar ejecuciones completadas exitosamente.
3. Consultar el Timeline de cada ejecución candidata.
4. Verificar que las etapas `Build`, `SmokeTests`, `ContractTests`, `LoadTest`, `E2ETests` y `CloudTests` hayan finalizado exitosamente.
5. Descartar ejecuciones que no cumplan los criterios.
6. Consultar en GitHub la fecha de cada commit asociado.
7. Generar `deployments.json`.
8. Calcular las métricas académicas.
9. Publicar el JSON como artefacto de Azure Pipelines.

## 4. Indicadores

| Indicador | Interpretación en este proyecto |
|---|---|
| Deployment Frequency | Frecuencia de ejecuciones elegibles utilizadas como entregas simuladas |
| Lead Time for Changes | Tiempo entre la fecha del commit y la finalización de la ejecución elegible |
| Change Failure Rate | Calculable matemáticamente con registros de fallos, pero no representa incidentes productivos en este proyecto |
| Mean Time to Restore | No calculable sin eventos de incidentes y restauraciones registrados |

Las métricas de frecuencia y lead time son aproximaciones académicas. No deben presentarse como indicadores DORA productivos reales.

## 5. Pruebas automatizadas

Ejecutar desde la raíz del repositorio:

```powershell
node --test metricas/tests/*.test.js
```

El módulo cuenta actualmente con 14 pruebas unitarias que cubren selección de ejecuciones, validación de etapas, enriquecimiento de fechas, cálculos y escenarios de error.

## 6. Ejecución en Azure Pipelines

La etapa `DORAMetrics` se ejecuta después de `CloudTests`, siempre que las etapas anteriores hayan finalizado correctamente.

El adaptador utiliza `SYSTEM_ACCESSTOKEN` para consultar Azure DevOps. La disponibilidad del token y sus permisos deben verificarse durante la integración.

El archivo generado se publica como artefacto `metricas-dora`.

## 7. Limitaciones

- No existen despliegues reales a producción.
- Una ejecución exitosa de CI no demuestra que una versión haya sido desplegada.
- El valor `failed: false` identifica el supuesto utilizado en los registros simulados; no demuestra ausencia de incidentes productivos.
- No se dispone de información real suficiente para determinar CFR o MTTR productivos.
- El cálculo depende de la disponibilidad de las APIs de Azure DevOps y GitHub.
- El historial consultado está limitado a las 100 ejecuciones recientes solicitadas a Azure DevOps.
- La ejecución actual puede no aparecer como completada cuando la etapa de métricas consulta el historial.

## 8. Buenas prácticas aplicadas

- Separación entre adquisición de datos y cálculo de métricas.
- Pruebas unitarias sin dependencia de servicios externos.
- Validación de fechas y consistencia de registros.
- Reutilización de consultas a commits repetidos.
- Exclusión de archivos generados mediante `.gitignore`.
- Publicación de evidencias como artefactos del pipeline.
- Distinción explícita entre simulación académica y métricas productivas.