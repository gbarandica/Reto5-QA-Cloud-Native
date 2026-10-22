from playwright.sync_api import Page


class Actor:
    """
    Representa a un usuario que interactúa con la aplicación.

    El actor utiliza una página de Playwright para ejecutar
    tareas y consultar el estado de la aplicación.
    """

    def __init__(self, nombre: str, page: Page):
        self.nombre = nombre
        self.page = page

    def intenta(self, tarea):
        """
        Ejecuta una tarea mediante el actor.
        """
        tarea.ejecutar(self)

    def pregunta(self, consulta):
        """
        Obtiene información de la aplicación.
        """
        return consulta.responder(self)