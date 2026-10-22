class AbrirCatalogo:
    """
    Tarea Screenplay que permite al actor
    navegar al catálogo de productos.
    """

    def ejecutar(self, actor):
        """
        Abre la página principal de la tienda
        utilizando Playwright.
        """
        actor.page.goto("/")