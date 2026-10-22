class BuscarProducto:
    """
    Task Screenplay que permite buscar productos
    por su nombre en el catálogo.
    """

    def __init__(self, nombre: str):
        self.nombre = nombre

    def ejecutar(self, actor):
        """
        Escribe el nombre del producto en el buscador.
        """
        buscador = actor.page.get_by_test_id("input-buscar")
        buscador.fill(self.nombre)