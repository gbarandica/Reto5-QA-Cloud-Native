from playwright.sync_api import expect


class AgregarAlCarrito:
    """
    Task Screenplay que agrega una cantidad
    determinada de un producto al carrito.
    """

    def __init__(self, cantidad: int = 1):
        self.cantidad = cantidad

    def ejecutar(self, actor):
        campo_cantidad = actor.page.get_by_test_id("input-cantidad")
        boton_agregar = actor.page.get_by_test_id("btn-agregar")
        mensaje = actor.page.get_by_test_id("mensaje-agregado")

        # Verificar que el producto puede comprarse.
        expect(boton_agregar).to_be_enabled()

        # Establecer la cantidad deseada.
        campo_cantidad.fill(str(self.cantidad))

        # Agregar el producto al carrito.
        boton_agregar.click()

        # Comprobar que la aplicación confirmó la acción.
        expect(mensaje).to_be_visible()