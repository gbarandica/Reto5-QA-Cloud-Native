from playwright.sync_api import expect


class ProductoEnCarrito:
    """
    Question Screenplay que consulta los productos
    registrados en el carrito de compras.
    """

    def responder(self, actor):
        filas = actor.page.get_by_test_id("fila-carrito")

        # Esperar a que exista al menos una fila.
        expect(filas.first).to_be_visible()

        productos = []

        for fila in filas.all():
            nombre = fila.get_by_test_id("fila-nombre").inner_text()
            cantidad = fila.get_by_test_id("fila-cantidad").inner_text()

            productos.append({
                "nombre": nombre,
                "cantidad": int(cantidad)
            })

        return productos