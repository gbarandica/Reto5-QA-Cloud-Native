Reto 5 - QA Cloud-Native
Automatización Inteligente con IA Generativa
Proyecto desarrollado para el Reto Práctico del Módulo 5 del Diplomado de Automatización de Pruebas de Software.
Objetivo
Implementar una estrategia integral de aseguramiento de calidad para una aplicación de comercio electrónico, combinando generación de datos sintéticos, automatización funcional, integración continua, pruebas de rendimiento, ejecución en navegadores cloud y buenas prácticas de ingeniería de software.

El proyecto incorpora progresivamente contenedores, pruebas de contratos y métricas de calidad.
Tecnologías
- Backend: JavaScript y Node.js.
- Datos de prueba: Faker.
- Automatización: Python, pytest y Playwright.
- BDD: pytest-bdd y Gherkin.
- Arquitectura de pruebas: patrón Screenplay.
- Inteligencia artificial: IA Generativa y MCP.
- CI/CD: Azure DevOps y Azure Pipelines.
- Pruebas de rendimiento: k6.
- Cloud Testing: Sauce Labs y Sauce Connect 5.
- Contenedores: Docker.
- Pruebas de contratos: Pact.
- Control de versiones: Git y GitHub.
Estructura del proyecto
| Directorio o archivo | Descripción |

|---|---|

| app-tienda/ | Aplicación de comercio electrónico utilizada como sistema bajo prueba. |

| datos/ | Generación y gestión de datos sintéticos. |

| e2e/ | Framework de automatización con Playwright, pytest-bdd y Screenplay. |

| e2e/features/ | Escenarios de comportamiento escritos en Gherkin. |

| e2e/steps/ | Implementación de los pasos de los escenarios BDD. |

| e2e/screenplay/ | Componentes reutilizables del patrón Screenplay. |

| e2e/conftest.py | Configuración de fixtures y ejecución local o remota mediante Sauce Labs. |

| pipeline/ | Recursos asociados a CI/CD y validaciones de calidad. |

| pact/ | Directorio destinado a las pruebas de contratos API. |

| docs/evidencias/ | Evidencias organizadas por fase del reto. |

| azure-pipelines.yml | Definición del pipeline de integración continua en Azure DevOps. |
Fases del reto
Fase 1. Generación reproducible de datos
Se implementó una estrategia de generación de datos sintéticos mediante Faker para disponer de información de prueba controlada y reutilizable.

La aplicación utiliza un catálogo de 25 productos distribuidos en cinco categorías.

Evidencias: [Fase 1](docs/evidencias/fase-1/)
Fase 2. Pipeline CI/CD con Quality Gates
Se configuró Azure Pipelines para automatizar la construcción de la aplicación y ejecutar validaciones de calidad.

El pipeline incluye:
- Construcción y preparación de la aplicación.
- Pruebas smoke para verificar los servicios principales.
- Pruebas de carga con k6.
- Validaciones automatizadas como parte del proceso de integración continua.
En las pruebas de carga se definieron criterios de aceptación sobre el tiempo de respuesta p95 y la tasa de errores.

Evidencias: [Fase 2](docs/evidencias/fase-2/)
Fase 3. Automatización BDD con IA Generativa
Se implementó un framework de automatización funcional utilizando Python, Playwright, pytest-bdd y el patrón Screenplay.

Los escenarios cubren funcionalidades principales de la aplicación:
1. Visualización de productos del catálogo.
2. Búsqueda de productos por nombre.
3. Búsqueda de productos inexistentes.
4. Agregar productos al carrito.
5. Confirmación exitosa de pedidos.
Se incorporaron herramientas de IA Generativa y MCP como apoyo al proceso de automatización y validación.

Resultado: cinco escenarios E2E ejecutados satisfactoriamente.

Evidencias: [Fase 3](docs/evidencias/fase-3/)
Fase 4. Ejecución de pruebas E2E en Sauce Labs
Se integró Sauce Labs al framework de automatización para ejecutar los escenarios BDD en un navegador remoto.

La integración utiliza:
- Sauce Labs: infraestructura de ejecución cloud.
- Sauce Connect 5: túnel para acceder a la aplicación iniciada dentro del agente de Azure Pipelines.
- Playwright: automatización del navegador.
- pytest-bdd: ejecución de escenarios BDD.
- Screenplay: organización de las interacciones y tareas.
- Azure Pipelines: orquestación de la ejecución y publicación de resultados.
Las credenciales de Sauce Labs se administran mediante variables de Azure DevOps, manteniendo la clave de acceso como secreto.
Flujo de ejecución
1. Se publica un cambio en la rama main de GitHub.
2. Azure DevOps inicia automáticamente el pipeline.
3. Se ejecutan las etapas de construcción, smoke, carga y pruebas E2E.
4. La etapa CloudTests inicia la aplicación y establece un túnel con Sauce Connect.
5. Playwright ejecuta los escenarios BDD en Sauce Labs.
6. Azure DevOps publica los resultados mediante JUnit y conserva los artefactos de la ejecución.
Etapas del pipeline
| Stage | Propósito | Resultado |

|---|---|---|

| Build | Preparar y validar la aplicación | Aprobado |

| SmokeTests | Verificar funcionalidades básicas | Aprobado |

| LoadTest | Ejecutar pruebas de carga con k6 | Aprobado |

| E2ETests | Ejecutar escenarios BDD en el agente CI | Aprobado |

| CloudTests | Ejecutar escenarios BDD en Sauce Labs | Aprobado |
Resultados obtenidos
Ejecución de Azure DevOps: #20261023.2

Commit: 846487a

| Indicador | Resultado |

|---|---|

| Stages completados | 5 de 5 |

| Escenarios E2E ejecutados en el agente CI | 5 |

| Escenarios E2E ejecutados en Sauce Labs | 5 |

| Total de pruebas reportadas | 10 |

| Pruebas aprobadas | 10 |

| Pruebas fallidas | 0 |

| Porcentaje de aprobación | 100% |

| Duración total del pipeline | 10 minutos y 6 segundos |

Entorno remoto validado: Windows 11 con Google Chrome 156.

Sauce Labs registró una sesión de aproximadamente 47 segundos, con 351 comandos, video, capturas de pantalla y logs de ejecución.

Estos resultados validan la ejecución remota en Chrome sobre Windows 11. No representan una validación de compatibilidad multinavegador.
Evidencias de la Fase 4
| Evidencia | Descripción |

|---|---|

| [01 - Ejecución automática en Azure DevOps](docs/evidencias/fase-4/01_Ejecucion_Automatica_Azure_DevOps.png) | Activación automática del pipeline después de publicar el commit. |

| [02 - Pipeline completo](docs/evidencias/fase-4/02_Pipeline_Completo_Sauce_Labs.png) | Cinco stages finalizados satisfactoriamente. |

| [03 - Ejecución remota en Sauce Labs](docs/evidencias/fase-4/03_Ejecucion_Remota_Sauce_Labs.png) | Sesión registrada en la plataforma cloud. |

| [04 - Detalle de la ejecución](docs/evidencias/fase-4/04_Detalle_Ejecucion_Sauce_Labs.png) | Video, comandos, capturas y logs de la sesión remota. |

| [05 - Resultados E2E locales y cloud](docs/evidencias/fase-4/05_Resultados_Pruebas_E2E_Local_Cloud.png) | Diez pruebas aprobadas, distribuidas en dos ejecuciones. |

Resultado de la fase: integración exitosa entre GitHub, Azure DevOps, Playwright y Sauce Labs, con ejecución automatizada y publicación de resultados.
Fase 5. Contenedores y pruebas de contratos
Se implementó una estrategia de contenerización y pruebas de contratos para la aplicación Tienda QA, utilizando Docker, Azure Container Registry (ACR), Pact y Azure DevOps.

El objetivo de esta fase fue garantizar que la aplicación pudiera ejecutarse en un entorno contenerizado y verificar la compatibilidad entre el consumidor (frontend) y el proveedor (API).
Contenerización con Docker
Se implementó el archivo app-tienda/Dockerfile para empaquetar la aplicación Node.js, instalar sus dependencias y ejecutar la generación de datos sintéticos.

La configuración incluye:
- Imagen base node:20-alpine.
- Instalación de dependencias de producción.
- Generación reproducible de datos mediante Faker.
- Exposición del puerto 3000.
- Healthcheck sobre el endpoint /api/health.
- Archivo .dockerignore para excluir archivos innecesarios del contexto de construcción.
La imagen fue construida y ejecutada localmente con la etiqueta reto5-tienda-qa:1.0.

Se verificó que el contenedor permaneciera en estado healthy y que el endpoint /api/health respondiera correctamente.

Comandos principales:

docker build -t reto5-tienda-qa:1.0 ./app-tienda

docker run -d --name reto5-tienda -p 3000:3000 reto5-tienda-qa:1.0

docker ps

Validación del servicio:

Invoke-RestMethod -Uri "http://localhost:3000/api/health"

Resultado: servicio app-tienda con estado ok.
Publicación en Azure Container Registry
Se creó un registro privado de contenedores en Microsoft Azure para almacenar y versionar la imagen Docker de la aplicación.

| Propiedad | Valor |

|---|---|

| Servicio | Azure Container Registry |

| Registro | acrreto5qacloudnative |

| Repositorio | reto5-tienda-qa |

| Etiqueta | 1.0 |

| Región | East US |

| Plan | Basic |

| Estado | Imagen publicada y verificada |

Comandos de publicación:

az acr login --name acrreto5qacloudnative

docker tag reto5-tienda-qa:1.0 acrreto5qacloudnative.azurecr.io/reto5-tienda-qa:1.0

docker push acrreto5qacloudnative.azurecr.io/reto5-tienda-qa:1.0

La publicación finalizó exitosamente y se comprobó desde Azure Portal que el repositorio contiene la imagen versionada 1.0.

Digest SHA-256:

c8d21c7dc28b126507fce65a28a781269fc333305d4be2c0e1fed1b7095ca701

La publicación en ACR permite almacenar la imagen para futuros despliegues. No se realizó un despliegue adicional en Azure App Service o Container Apps, ya que era opcional.
Contract Testing con Pact
Se implementaron pruebas de contrato Consumer-Driven utilizando @pact-foundation/pact.

Los participantes del contrato son:
- Consumer: TiendaQAFrontend, que consume los servicios del catálogo.
- Provider: TiendaQAAPI, que expone los endpoints REST.
- Contrato: pact/contracts/TiendaQAFrontend-TiendaQAAPI.json.
Se definieron dos interacciones:

| Endpoint | Método | Validación |

|---|---|---|

| /api/productos | GET | Consulta del catálogo y estructura de los productos |

| /api/productos/1 | GET | Consulta del detalle de un producto y estructura de la respuesta |

Las pruebas del consumidor verifican las respuestas esperadas mediante un servidor simulado de Pact. Posteriormente, las pruebas del proveedor verifican que la API real satisface las interacciones definidas en el contrato.

Estructura implementada:

pact/

├── consumer/

│   └── productos.consumer.test.cjs

├── provider/

│   └── productos.provider.test.cjs

├── contracts/

│   └── TiendaQAFrontend-TiendaQAAPI.json

├── package.json

└── package-lock.json

Ejecución:

Desde el directorio pact/, con la API iniciada:

npm ci

npm test

También pueden ejecutarse las verificaciones por separado:

npm run test:consumer

npm run test:provider

Resultado: las dos interacciones del consumidor y las dos verificaciones del proveedor finalizaron correctamente.
Integración de Pact en Azure DevOps
Se incorporó una nueva etapa ContractTests al archivo azure-pipelines.yml, después de SmokeTests y antes de LoadTest.

Esta etapa instala las dependencias, inicia la aplicación, espera a que el endpoint de salud esté disponible y ejecuta las pruebas Consumer y Provider de Pact.

Flujo actualizado del pipeline:
1. Build: preparación de la aplicación.
2. SmokeTests: validación básica de la API.
3. ContractTests: verificación de contratos con Pact.
4. LoadTest: pruebas de carga y Quality Gates con k6.
5. E2ETests: escenarios funcionales con Playwright y BDD.
6. CloudTests: ejecución remota mediante Sauce Labs.
Ejecución validada: #20261024.1

Commit: f9eb6a1

| Indicador | Resultado |

|---|---|

| Etapas del pipeline | 6 de 6 aprobadas |

| Etapa ContractTests | Aprobada |

| Contratos verificados | Catálogo y detalle de producto |

| Verificación Provider | Exitosa |

| Estado general | Success |

| Duración total | 6 minutos y 44 segundos |

La integración permite detectar incompatibilidades entre el consumidor y el proveedor antes de continuar con las pruebas de carga y las pruebas E2E.
Reto extra: análisis de microservicios
Se evaluó la conveniencia de dividir la aplicación Tienda QA en microservicios.

Actualmente se recomienda mantener un monolito modular, debido al tamaño de la aplicación y al alcance funcional del proyecto.

Una posible evolución contemplaría servicios independientes de:
- Catálogo: información y consulta de productos.
- Inventario: disponibilidad y reserva de existencias.
- Pedidos: creación y gestión de órdenes.
En esa arquitectura aparecerían contratos entre el frontend y el catálogo, entre pedidos e inventario y entre pedidos y catálogo.

La separación permitiría escalar y desplegar componentes de forma independiente, pero también introduciría mayor complejidad operativa, comunicación distribuida y necesidades adicionales de observabilidad y pruebas de integración.

Decisión arquitectónica: conservar el monolito modular mientras no existan necesidades justificadas de escalabilidad independiente o autonomía entre equipos. Si la aplicación evoluciona a microservicios, ampliar las pruebas de contrato Pact para cubrir las nuevas interacciones.
Evidencias de la Fase 5
| Evidencia | Descripción |

|---|---|

| [01 - Ejecución automática del pipeline](docs/evidencias/fase-5/01_Ejecucion_automatica_pipeline_CICD_Pact_Azure_DevOps.png) | Activación automática del pipeline CI/CD después de publicar los cambios de Docker y Pact en GitHub. |

| [02 - Pipeline CI/CD con seis etapas exitosas](docs/evidencias/fase-5/02_Pipeline_CICD_6_Etapas_Exitosas_Azure_DevOps.png) | Ejecución satisfactoria de las seis etapas del pipeline, incluida la nueva etapa ContractTests. |

| [03 - Ejecución de pruebas de contratos Pact](docs/evidencias/fase-5/03_Ejecucion_Pruebas_Contratos_Pact_Azure_DevOps.png) | Ejecución de las pruebas Consumer y Provider de Pact dentro del pipeline de Azure DevOps. |

| [04 - Verificación exitosa del Provider](docs/evidencias/fase-5/04_Verificacion_Exitosa_Provider_Pact_Azure_DevOps.png) | Verificación satisfactoria de los contratos de los endpoints /api/productos y /api/productos/1, validando respuestas HTTP 200 y estructuras JSON esperadas. |

| [05 - Contenedor Docker saludable](docs/evidencias/fase-5/05_Contenedor_Docker_Healthy_API_Tienda_QA.png) | Ejecución de Tienda QA en Docker, confirmando el estado healthy del contenedor y la respuesta correcta del endpoint /api/health. |

| [06 - Publicación de imagen Docker en Azure ACR](docs/evidencias/fase-5/06_Publicacion_Imagen_Docker_Azure_ACR.png) | Autenticación, etiquetado y publicación exitosa de la imagen reto5-tienda-qa:1.0 en Azure Container Registry mediante docker push. |

| [07 - Imagen Docker almacenada en Azure Container Registry](docs/evidencias/fase-5/07_Imagen_Docker_Publicada_Azure_Container_Registry.png) | Verificación desde Azure Portal del repositorio reto5-tienda-qa, la etiqueta 1.0 y su identificador SHA-256. |

Resultado de la fase: contenerización exitosa de Tienda QA, publicación de la imagen en Azure Container Registry y validación de contratos Consumer y Provider mediante Pact, integrados en un pipeline CI/CD con seis etapas aprobadas.

**
Fase 6. Métricas DORA y estrategia de calidad
Se implementó un módulo académico de observabilidad del proceso CI/CD, integrado como séptima etapa DORAMetrics en Azure DevOps. El módulo consulta el historial de ejecuciones, verifica las seis etapas de calidad obligatorias, recupera las fechas de los commits desde GitHub y calcula indicadores inspirados en DORA a partir de entregas simuladas.
Componentes principales
Componente	Responsabilidad
metricas/adaptadores/azure-devops.js	Consulta y validación de ejecuciones y commits.
metricas/calcular-dora.js	Cálculo de indicadores académicos.
metricas/tests/	14 pruebas unitarias del adaptador y la calculadora.
metricas/README.md	Guía técnica y limitaciones del módulo.
docs/Fase-6-Metricas-DORA-Estrategia-Calidad.md	Informe de métricas, pirámide de pruebas y riesgos de calidad.


Pipeline CI/CD actualizado
Orden	Etapa	Propósito
1	Build	Preparación y validación de la aplicación.
2	SmokeTests	Validación básica de la API.
3	ContractTests	Verificación de contratos Consumer y Provider con Pact.
4	LoadTest	Pruebas de carga y Quality Gates con k6.
5	E2ETests	Escenarios funcionales con Playwright, pytest-bdd y Screenplay.
6	CloudTests	Ejecución remota con Sauce Labs.
7	DORAMetrics	Pruebas unitarias, recopilación y cálculo de métricas simuladas.


Resultados de la ejecución integrada
Ejecución validada: Azure DevOps #20261025.3.
Indicador	Resultado
Etapas aprobadas	7 de 7
Pruebas unitarias DORA	14 aprobadas
Duración total	7 minutos y 25 segundos
Artefacto publicado	metricas-dora


Métricas DORA académicas
Indicador	Resultado de la simulación
Registros elegibles de entrega simulada	2
Ventana observada	1 día
Deployment Frequency	2 entregas simuladas por día
Lead Time for Changes	0,13 horas
Change Failure Rate	0 % en los registros simulados
MTTR	No calculable: sin incidentes registrados


Importante: no se han realizado despliegues productivos ni se dispone de un registro de incidentes de producción. Estas métricas corresponden a una simulación académica; el Change Failure Rate de 0 % no demuestra ausencia de fallos en producción.
Ejecución de pruebas unitarias
Desde la raíz del repositorio:
node --test metricas/tests/*.test.js
La consulta real a Azure DevOps requiere las variables de entorno y los permisos de lectura configurados para el adaptador. El pipeline ejecuta automáticamente la etapa DORAMetrics. El archivo metricas/deployments.json se genera durante la ejecución y no se versiona.
Documentación y evidencias
- [Informe completo de la Fase 6](docs/Fase-6-Metricas-DORA-Estrategia-Calidad.md).
- [Evidencias de la Fase 6](docs/evidencias/fase-6/).
- [Ejecución exitosa del pipeline](docs/evidencias/fase-6/03_Ejecucion_Exitosa_Pipeline_DORA.png).
- [Etapa DORAMetrics aprobada](docs/evidencias/fase-6/04_Etapa_DORAMetrics_Exitosa.png).
- [Artefacto DORA publicado](docs/evidencias/fase-6/05_Artefacto_DORA_Publicado.png).
- [Resultados de las métricas DORA](docs/evidencias/fase-6/06_Resultados_Metricas_DORA.png).
Resultado de la fase: módulo DORA integrado en CI, 14 pruebas unitarias aprobadas, indicadores académicos generados y estrategia de calidad documentada.
Estado del proyecto
Fases 1 a 6 desarrolladas y documentadas.
- Fase 1: generación reproducible de datos con Faker.
- Fase 2: pipeline CI/CD y Quality Gates con k6.
- Fase 3: automatización E2E con Playwright, pytest-bdd y Screenplay.
- Fase 4: ejecución remota de pruebas E2E mediante Sauce Labs.
- Fase 5: Docker, Azure Container Registry y pruebas de contratos Pact.
- Fase 6: métricas DORA académicas, 14 pruebas unitarias, pirámide de pruebas y gestión de riesgos.
Última ejecución integrada validada: Azure DevOps #20261025.3, con siete etapas completadas satisfactoriamente.

Alcance: se han validado procesos de CI, pruebas automatizadas y publicación de una imagen Docker en Azure Container Registry. No se ha implementado un despliegue productivo. Las métricas DORA representan entregas simuladas.
Referencia académica
Proyecto desarrollado como parte del Módulo 5 del Diplomado de Automatización de Pruebas de Software.