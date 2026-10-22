import pytest
from pytest_bdd import scenarios, given, when, then
from playwright.sync_api import expect

from screenplay.actors.actor import Actor
from screenplay.tasks.abrir_catalogo import AbrirCatalogo
from screenplay.tasks.seleccionar_producto import SeleccionarProducto
from screenplay.tasks.agregar_al_carrito import AgregarAlCarrito
from screenplay.tasks.abrir_carrito import AbrirCarrito
from screenplay.questions.producto_en_carrito import ProductoEnCarrito


# Vincular los escenarios Gherkin con pytest.
scenarios("../features/carrito.feature")


@pytest.fixture
def cliente(page):
    """Crea el actor que interactúa con el navegador."""
    return Actor("Cliente", page)


@pytest.fixture
def producto_seleccionado():
    """Comparte los datos del producto durante el escenario."""
    return {"nombre": ""}


@given("que el cliente ingresa al catálogo")
def ingresar_catalogo(cliente):
    cliente.intenta(AbrirCatalogo())


@when("selecciona un producto disponible")
def seleccionar_producto(cliente, producto_seleccionado):
    cliente.intenta(SeleccionarProducto())

    nombre = cliente.page.get_by_test_id("detalle-nombre")

    expect(nombre).to_be_visible()

    producto_seleccionado["nombre"] = nombre.inner_text()


@when("agrega una unidad al carrito")
def agregar_producto(cliente):
    cliente.intenta(AgregarAlCarrito(1))


@when("abre el carrito de compras")
def abrir_carrito(cliente):
    cliente.intenta(AbrirCarrito())


@then("debe visualizar el producto agregado con cantidad uno")
def verificar_producto_carrito(cliente, producto_seleccionado):
    productos = cliente.pregunta(ProductoEnCarrito())

    nombre_esperado = producto_seleccionado["nombre"]

    assert len(productos) == 1, (
        f"Se esperaba un producto en el carrito, "
        f"pero se encontraron {len(productos)}"
    )

    producto = productos[0]

    assert producto["nombre"] == nombre_esperado, (
        f"Se esperaba '{nombre_esperado}', "
        f"pero se encontró '{producto['nombre']}'"
    )

    assert producto["cantidad"] == 1, (
        f"Se esperaba cantidad 1, "
        f"pero se encontró {producto['cantidad']}"
    )