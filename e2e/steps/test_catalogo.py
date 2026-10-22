import pytest

from pytest_bdd import scenarios, given, when, then
from playwright.sync_api import expect

from screenplay.actors.actor import Actor
from screenplay.tasks.abrir_catalogo import AbrirCatalogo
from screenplay.questions.cantidad_productos import CantidadProductos
from screenplay.tasks.buscar_producto import BuscarProducto
from screenplay.questions.nombres_productos import NombresProductos
from urllib.parse import urlparse, parse_qs


# Vincula los escenarios Gherkin con pytest.
scenarios("../features/catalogo.feature")


@pytest.fixture
def cliente(page):
    """
    Crea un actor utilizando la página de Playwright.
    """
    return Actor("Cliente", page)


@given("que el cliente ingresa al catálogo")
def ingresar_catalogo(cliente):
    """
    El actor abre el catálogo de productos.
    """
    cliente.intenta(AbrirCatalogo())


@when("se cargan los productos de la tienda")
def cargar_productos(cliente):
    """
    Espera a que el catálogo muestre los 25 productos.
    """
    tarjetas = cliente.page.get_by_test_id("producto-card")
    expect(tarjetas).to_have_count(25)


@then("debe visualizar 25 productos")
def verificar_productos(cliente):
    """
    Consulta mediante Screenplay la cantidad de productos.
    """
    cantidad = cliente.pregunta(CantidadProductos())

    assert cantidad == 25, (
        f"Se esperaban 25 productos, pero se encontraron {cantidad}"
    )

@pytest.fixture
def busqueda():
    """
    Comparte el término de búsqueda entre los pasos
    de un mismo escenario.
    """
    return {"nombre": ""}


@when("busca un producto por su nombre")
def buscar_por_nombre(cliente, busqueda):
    """
    Selecciona un producto existente, realiza la búsqueda
    y espera la respuesta correspondiente de la API.
    """
    nombres = cliente.pregunta(NombresProductos())

    assert nombres, "El catálogo no contiene productos para buscar"

    nombre = nombres[0]
    busqueda["nombre"] = nombre

    def es_respuesta_busqueda(response):
        url = urlparse(response.url)
        parametros = parse_qs(url.query)

        return (
            url.path == "/api/productos"
            and parametros.get("q") == [nombre]
            and response.request.method == "GET"
            and response.status == 200
        )

    with cliente.page.expect_response(es_respuesta_busqueda):
        cliente.intenta(BuscarProducto(nombre))


@then("debe visualizar únicamente productos que coincidan con la búsqueda")
def verificar_resultados_busqueda(cliente, busqueda):
    """
    Comprueba que todos los productos mostrados
    coinciden con el término buscado.
    """
    nombre_buscado = busqueda["nombre"]

    nombres_encontrados = cliente.pregunta(NombresProductos())

    assert nombres_encontrados, "La búsqueda no devolvió productos"

    for nombre in nombres_encontrados:
        assert nombre_buscado.casefold() in nombre.casefold(), (
            f"El producto '{nombre}' no coincide "
            f"con la búsqueda '{nombre_buscado}'"
        )