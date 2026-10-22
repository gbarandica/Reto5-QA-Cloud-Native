# Fase 3 — Del caso manual al automatizado con IA

## 1. Objetivo

Implementar pruebas E2E de la aplicación App Tienda utilizando Playwright, Python, pytest-bdd y el patrón Screenplay, incorporando inteligencia artificial como apoyo para identificar y automatizar un escenario de borde.

## 2. Herramientas utilizadas

- **Azure Test Plans:** documentación y gestión de casos manuales.
- **Playwright MCP:** inspección de la aplicación mediante herramientas del protocolo MCP.
- **MCP Inspector:** conexión al servidor Playwright MCP y ejecución de herramientas como `browser_snapshot`.
- **Claude:** análisis del comportamiento observado y propuesta de un escenario de borde.
- **Python, Playwright y pytest-bdd:** implementación y ejecución de pruebas automatizadas.
- **Screenplay:** separación de actores, tareas y consultas.
- **Azure Pipelines:** ejecución automatizada en CI/CD y publicación de resultados JUnit.

## 3. Procedimiento realizado

1. Se documentaron los casos manuales de Catálogo, Carrito y Pedidos en Azure Test Plans.
2. Se implementaron los escenarios automatizados mediante Gherkin, Playwright, pytest-bdd y Screenplay.
3. Se configuró un servidor Playwright MCP y se estableció conexión mediante MCP Inspector.
4. Se inspeccionó la aplicación App Tienda en `http://localhost:3000`, identificando el campo de búsqueda y el comportamiento del catálogo.
5. Se verificó que, al buscar un producto inexistente, la aplicación no mostraba tarjetas de productos y presentaba el mensaje «No hay productos que coincidan.».
6. Se proporcionó a Claude el comportamiento observado y se solicitó la propuesta de un escenario de borde.
7. Se implementó el escenario propuesto en `catalogo.feature` y `test_catalogo.py`, reutilizando componentes del patrón Screenplay.
8. Se ejecutaron cinco escenarios automatizados localmente y en Azure Pipelines, obteniendo cinco resultados aprobados.
9. Se registró el caso CP-004 (ID 11) en Azure Test Plans y se marcó como automatizado.

## 4. Escenario de borde generado con apoyo de IA

**Caso:** CP-004 — Buscar un producto inexistente en el catálogo.

**Objetivo:** comprobar que el sistema informa correctamente cuando una búsqueda no devuelve coincidencias.

**Escenario Gherkin:**

```gherkin
Scenario: Buscar un producto inexistente en el catálogo
  Given que el cliente ingresa al catálogo
  When busca el producto inexistente "ProductoInexistenteXYZ999"
  Then no debe visualizar productos en el catálogo
  And debe visualizar el mensaje "No hay productos que coincidan."
```

**Riesgo funcional cubierto:** evitar que el usuario visualice resultados incorrectos o reciba una respuesta ambigua cuando no existen productos coincidentes.

## 5. Uso de Claude y Playwright MCP

Se utilizó Playwright MCP mediante MCP Inspector para observar el comportamiento real de la aplicación.

Posteriormente, se proporcionaron a Claude los hallazgos de esa inspección y se solicitó un escenario de borde compatible con Gherkin, Playwright, pytest-bdd y Screenplay.

El prompt y la respuesta de Claude están documentados en la evidencia `01-claude-prompt-escenario-borde.png`.

**Alcance de la integración:** Claude y MCP Inspector se utilizaron como herramientas complementarias. No se estableció una conexión directa entre Claude y el servidor MCP.

## 6. Resultados

- **Ejecución local:** 5 escenarios aprobados.
- **Azure Pipelines:** ejecución `#20261022.2`, completada correctamente.
- **Azure Test Plans:** Test Run ID 3, con cinco pruebas aprobadas y cero fallidas.
- **Publicación:** resultados JUnit disponibles en Azure DevOps.
- **Trazabilidad:** CP-004 (ID 11) registrado con estado de automatización `Automated`.

## 7. Evidencias

| Archivo | Descripción |
|---|---|
| `01-claude-prompt-escenario-borde.png` | Prompt y propuesta del escenario de borde con Claude |
| `02-pytest-cinco-escenarios-verde.png` | Ejecución local de los cinco escenarios |
| `03-azure-pipelines-cinco-pruebas-aprobadas.png` | Pipeline ejecutado correctamente |
| `04-azure-test-plans-test-run-3.png` | Resultados automatizados publicados en Test Plans |
| `05-azure-test-plans-cp004-automatizado.png` | Asociación de automatización del caso CP-004 |
| `06-playwright-mcp-inspector-conectado.png` | Servidor Playwright MCP conectado |
| `07-playwright-mcp-inspeccion-catalogo.png` | Inspección del catálogo mediante `browser_snapshot` |

## 8. Conclusión

La Fase 3 permitió integrar pruebas manuales, automatización E2E, arquitectura Screenplay, asistencia de IA y ejecución continua mediante Azure DevOps.

El escenario de borde permitió ampliar la cobertura funcional del catálogo y demostrar cómo la inspección de una aplicación y el apoyo de IA pueden contribuir al diseño de pruebas automatizadas.