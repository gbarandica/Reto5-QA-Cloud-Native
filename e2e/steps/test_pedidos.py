import pytest
from pytest_bdd import scenarios, given, when, then
from playwright.sync_api import expect

from screenplay.actors.actor import Actor
from screenplay.tasks.abrir_catalogo import AbrirCatalogo
from screenplay.tasks.seleccionar_producto import SeleccionarProducto
from screenplay.tasks.agregar_al_carrito import AgregarAlCarrito
from screenplay.tasks.abrir_carrito import AbrirCarrito
from screenplay.tasks.confirmar_pedido import ConfirmarPedido


# Vincular los escenarios Gherkin con pytest.
scenarios("../features/pedidos.feature")


@pytest.fixture
def cliente(page):
    """Crea un actor independiente para cada escenario."""
    return Actor("Cliente", page)


@given("que el cliente tiene un producto disponible en el carrito")
def preparar_carrito(cliente):
    """
    Prepara el estado inicial necesario para confirmar un pedido.
    """
    cliente.intenta(AbrirCatalogo())
    cliente.intenta(SeleccionarProducto())
    cliente.intenta(AgregarAlCarrito(1))
    cliente.intenta(AbrirCarrito())

    # Verificar que existe un producto antes de confirmar.
    filas = cliente.page.get_by_test_id("fila-carrito")
    expect(filas).to_have_count(1)


@when("confirma el pedido")
def confirmar_compra(cliente):
    cliente.intenta(ConfirmarPedido())


@then("debe visualizar el mensaje de pedido confirmado")
def verificar_confirmacion(cliente):
    mensaje = cliente.page.get_by_test_id("pedido-confirmado")

    expect(mensaje).to_be_visible()
    expect(mensaje).to_contain_text("Pedido confirmado")


@then("el carrito debe quedar vacío")
def verificar_carrito_vacio(cliente):
    carrito_vacio = cliente.page.get_by_test_id("carrito-vacio")
    filas = cliente.page.get_by_test_id("fila-carrito")
    contador = cliente.page.get_by_test_id("carrito-contador")

    expect(carrito_vacio).to_be_visible()
    expect(filas).to_have_count(0)
    expect(contador).to_have_text("0")