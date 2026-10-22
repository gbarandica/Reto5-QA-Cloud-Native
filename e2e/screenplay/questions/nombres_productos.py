from playwright.sync_api import expect


class NombresProductos:
    """
    Question Screenplay que obtiene los nombres
    de los productos visibles en el catálogo.
    """

    def responder(self, actor):
        """
        Espera a que termine la carga del catálogo
        y devuelve los nombres de los productos.
        """
        cargando = actor.page.get_by_test_id("cargando")

        expect(cargando).to_have_count(0)

        nombres = actor.page.get_by_test_id("producto-nombre")

        return nombres.all_text_contents()