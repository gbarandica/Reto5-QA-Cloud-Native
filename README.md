# Reto 5 - QA Cloud-Native

## Automatización Inteligente con IA Generativa

Proyecto desarrollado para el **Reto Práctico del Módulo 5 del Diplomado de Automatización de Pruebas de Software**.

## Objetivo

Implementar una estrategia integral de aseguramiento de calidad para una aplicación de comercio electrónico, combinando generación de datos sintéticos, automatización funcional, integración continua, pruebas de rendimiento, ejecución en navegadores cloud y buenas prácticas de ingeniería de software.

El proyecto incorpora progresivamente contenedores, pruebas de contratos y métricas de calidad.

## Tecnologías

- **Backend:** JavaScript y Node.js.
- **Datos de prueba:** Faker.
- **Automatización:** Python, pytest y Playwright.
- **BDD:** pytest-bdd y Gherkin.
- **Arquitectura de pruebas:** patrón Screenplay.
- **Inteligencia artificial:** IA Generativa y MCP.
- **CI/CD:** Azure DevOps y Azure Pipelines.
- **Pruebas de rendimiento:** k6.
- **Cloud Testing:** Sauce Labs y Sauce Connect 5.
- **Contenedores:** Docker.
- **Pruebas de contratos:** Pact.
- **Control de versiones:** Git y GitHub.

## Estructura del proyecto

| Directorio o archivo | Descripción |
|---|---|
| `app-tienda/` | Aplicación de comercio electrónico utilizada como sistema bajo prueba. |
| `datos/` | Generación y gestión de datos sintéticos. |
| `e2e/` | Framework de automatización con Playwright, pytest-bdd y Screenplay. |
| `e2e/features/` | Escenarios de comportamiento escritos en Gherkin. |
| `e2e/steps/` | Implementación de los pasos de los escenarios BDD. |
| `e2e/screenplay/` | Componentes reutilizables del patrón Screenplay. |
| `e2e/conftest.py` | Configuración de fixtures y ejecución local o remota mediante Sauce Labs. |
| `pipeline/` | Recursos asociados a CI/CD y validaciones de calidad. |
| `pact/` | Directorio destinado a las pruebas de contratos API. |
| `docs/evidencias/` | Evidencias organizadas por fase del reto. |
| `azure-pipelines.yml` | Definición del pipeline de integración continua en Azure DevOps. |

## Fases del reto

### Fase 1. Generación reproducible de datos

Se implementó una estrategia de generación de datos sintéticos mediante Faker para disponer de información de prueba controlada y reutilizable.

La aplicación utiliza un catálogo de 25 productos distribuidos en cinco categorías.

**Evidencias:** [Fase 1](docs/evidencias/fase-1/)

### Fase 2. Pipeline CI/CD con Quality Gates

Se configuró Azure Pipelines para automatizar la construcción de la aplicación y ejecutar validaciones de calidad.

El pipeline incluye:

- Construcción y preparación de la aplicación.
- Pruebas smoke para verificar los servicios principales.
- Pruebas de carga con k6.
- Validaciones automatizadas como parte del proceso de integración continua.

En las pruebas de carga se definieron criterios de aceptación sobre el tiempo de respuesta p95 y la tasa de errores.

**Evidencias:** [Fase 2](docs/evidencias/fase-2/)

### Fase 3. Automatización BDD con IA Generativa

Se implementó un framework de automatización funcional utilizando Python, Playwright, pytest-bdd y el patrón Screenplay.

Los escenarios cubren funcionalidades principales de la aplicación:

1. Visualización de productos del catálogo.
2. Búsqueda de productos por nombre.
3. Búsqueda de productos inexistentes.
4. Agregar productos al carrito.
5. Confirmación exitosa de pedidos.

Se incorporaron herramientas de IA Generativa y MCP como apoyo al proceso de automatización y validación.

**Resultado:** cinco escenarios E2E ejecutados satisfactoriamente.

**Evidencias:** [Fase 3](docs/evidencias/fase-3/)

### Fase 4. Ejecución de pruebas E2E en Sauce Labs

Se integró Sauce Labs al framework de automatización para ejecutar los escenarios BDD en un navegador remoto.

La integración utiliza:

- **Sauce Labs:** infraestructura de ejecución cloud.
- **Sauce Connect 5:** túnel para acceder a la aplicación iniciada dentro del agente de Azure Pipelines.
- **Playwright:** automatización del navegador.
- **pytest-bdd:** ejecución de escenarios BDD.
- **Screenplay:** organización de las interacciones y tareas.
- **Azure Pipelines:** orquestación de la ejecución y publicación de resultados.

Las credenciales de Sauce Labs se administran mediante variables de Azure DevOps, manteniendo la clave de acceso como secreto.

#### Flujo de ejecución

1. Se publica un cambio en la rama `main` de GitHub.
2. Azure DevOps inicia automáticamente el pipeline.
3. Se ejecutan las etapas de construcción, smoke, carga y pruebas E2E.
4. La etapa `CloudTests` inicia la aplicación y establece un túnel con Sauce Connect.
5. Playwright ejecuta los escenarios BDD en Sauce Labs.
6. Azure DevOps publica los resultados mediante JUnit y conserva los artefactos de la ejecución.

#### Etapas del pipeline

| Stage | Propósito | Resultado |
|---|---|---|
| `Build` | Preparar y validar la aplicación | Aprobado |
| `SmokeTests` | Verificar funcionalidades básicas | Aprobado |
| `LoadTest` | Ejecutar pruebas de carga con k6 | Aprobado |
| `E2ETests` | Ejecutar escenarios BDD en el agente CI | Aprobado |
| `CloudTests` | Ejecutar escenarios BDD en Sauce Labs | Aprobado |

#### Resultados obtenidos

**Ejecución de Azure DevOps:** `#20261023.2`

**Commit:** `846487a`

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

**Entorno remoto validado:** Windows 11 con Google Chrome 156.

Sauce Labs registró una sesión de aproximadamente 47 segundos, con 351 comandos, video, capturas de pantalla y logs de ejecución.

Estos resultados validan la ejecución remota en Chrome sobre Windows 11. No representan una validación de compatibilidad multinavegador.

#### Evidencias de la Fase 4

| Evidencia | Descripción |
|---|---|
| [01 - Ejecución automática en Azure DevOps](docs/evidencias/fase-4/01_Ejecucion_Automatica_Azure_DevOps.png) | Activación automática del pipeline después de publicar el commit. |
| [02 - Pipeline completo](docs/evidencias/fase-4/02_Pipeline_Completo_Sauce_Labs.png) | Cinco stages finalizados satisfactoriamente. |
| [03 - Ejecución remota en Sauce Labs](docs/evidencias/fase-4/03_Ejecucion_Remota_Sauce_Labs.png) | Sesión registrada en la plataforma cloud. |
| [04 - Detalle de la ejecución](docs/evidencias/fase-4/04_Detalle_Ejecucion_Sauce_Labs.png) | Video, comandos, capturas y logs de la sesión remota. |
| [05 - Resultados E2E locales y cloud](docs/evidencias/fase-4/05_Resultados_Pruebas_E2E_Local_Cloud.png) | Diez pruebas aprobadas, distribuidas en dos ejecuciones. |

**Resultado de la fase:** integración exitosa entre GitHub, Azure DevOps, Playwright y Sauce Labs, con ejecución automatizada y publicación de resultados.

### Fase 5. Contenedores y pruebas de contratos

**Pendiente de implementación y validación.**

Se contempla incorporar Docker para la ejecución de componentes del proyecto y Pact para verificar contratos entre servicios.

### Fase 6. Métricas DORA y estrategia de calidad

**Pendiente de desarrollo.**

Se contempla documentar métricas DORA, pirámide de pruebas, riesgos y recomendaciones de calidad para un entorno profesional.

## Estado del proyecto

**Fases 1 a 4 desarrolladas y documentadas.**

La integración de pruebas E2E con Sauce Labs fue validada exitosamente en Azure DevOps.

Las fases 5 y 6 se encuentran pendientes.

## Referencia académica

Proyecto basado en los ejercicios del Módulo 5 del Diplomado de Automatización de Pruebas de Software.

Repositorio de referencia:

https://github.com/oach82/Diplomado-Modulo5