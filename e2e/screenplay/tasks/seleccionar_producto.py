from playwright.sync_api import expect


class SeleccionarProducto:
    """
    Task Screenplay que busca y selecciona
    un producto disponible desde el catálogo.
    """

    def ejecutar(self, actor):
        tarjetas = actor.page.get_by_test_id("producto-card")

        # Esperar a que el catálogo cargue completamente.
        expect(tarjetas).to_have_count(25)

        cantidad = tarjetas.count()

        for indice in range(cantidad):
            # Seleccionar la tarjeta correspondiente.
            tarjeta = tarjetas.nth(indice)

            # Abrir el detalle del producto.
            tarjeta.get_by_test_id("ver-detalle").click()

            boton_agregar = actor.page.get_by_test_id("btn-agregar")

            # Esperar a que termine la carga del detalle.
            expect(boton_agregar).to_be_visible()

            # Si el producto tiene disponibilidad, terminar.
            if boton_agregar.is_enabled():
                return

            # Regresar al catálogo si está agotado.
            actor.page.get_by_test_id("volver").click()

            # Esperar a que se reconstruya el catálogo.
            expect(tarjetas).to_have_count(25)

        raise AssertionError(
            "No se encontró ningún producto disponible en el catálogo"
        )