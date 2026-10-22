from playwright.sync_api import expect


class AbrirCarrito:
    """
    Task Screenplay que permite al actor
    navegar hasta el carrito de compras.
    """

    def ejecutar(self, actor):
        # Localizar el enlace del carrito.
        enlace_carrito = actor.page.get_by_test_id("nav-carrito")

        # Navegar mediante la interfaz.
        enlace_carrito.click()

        # Verificar que se abrió la página del carrito.
        titulo = actor.page.get_by_test_id("titulo-carrito")

        expect(titulo).to_be_visible()
        expect(titulo).to_have_text("Tu carrito")