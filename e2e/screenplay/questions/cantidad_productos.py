class CantidadProductos:
    """
    Question Screenplay que consulta cuántos productos
    aparecen en el catálogo de la tienda.
    """

    def responder(self, actor):
        """
        Espera a que el catálogo termine de cargar
        y devuelve la cantidad de tarjetas visibles.
        """
        tarjetas = actor.page.get_by_test_id("producto-card")

        tarjetas.first.wait_for(state="visible")

        return tarjetas.count()