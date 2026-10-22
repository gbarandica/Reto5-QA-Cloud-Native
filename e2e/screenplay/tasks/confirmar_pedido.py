from urllib.parse import urlparse

from playwright.sync_api import expect


class ConfirmarPedido:
    """
    Task Screenplay que confirma la compra
    y verifica la respuesta de la API.
    """

    def ejecutar(self, actor):
        boton_confirmar = actor.page.get_by_test_id("btn-confirmar")

        # Verificar que el botón esté disponible.
        expect(boton_confirmar).to_be_enabled()

        # Esperar la respuesta de la API al confirmar.
        with actor.page.expect_response(
            lambda response: (
                urlparse(response.url).path == "/api/pedidos"
                and response.request.method == "POST"
            )
        ) as respuesta_pedido:
            boton_confirmar.click()

        respuesta = respuesta_pedido.value

        assert 200 <= respuesta.status < 300, (
            f"La API rechazó el pedido. "
            f"Código HTTP: {respuesta.status}"
        )

        # Verificar que la interfaz muestre la confirmación.
        mensaje = actor.page.get_by_test_id("pedido-confirmado")

        expect(mensaje).to_be_visible()
        expect(mensaje).to_contain_text("Pedido confirmado")