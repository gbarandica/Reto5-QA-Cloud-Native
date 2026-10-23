
import json
import os

import pytest


def _usar_sauce() -> bool:
    """Indica si se solicitó ejecutar las pruebas en Sauce Labs."""
    return (
        os.getenv("SAUCE") == "1"
        and bool(os.getenv("SAUCE_USERNAME"))
        and bool(os.getenv("SAUCE_ACCESS_KEY"))
    )


def _configurar_entorno_sauce():
    """Prepara la conexión de Playwright con Selenium Grid de Sauce Labs."""

    region = os.getenv("SAUCE_REGION", "us-west-1")

    sauce_options = {
        "username": os.environ["SAUCE_USERNAME"],
        "accessKey": os.environ["SAUCE_ACCESS_KEY"],
        "name": os.getenv("SAUCE_TEST_NAME", "Reto 5 - QA Cloud Native"),
        "build": os.getenv("BUILD_TAG", "reto5-local"),
        "devTools": True,
    }

    tunnel = os.getenv("SAUCE_TUNNEL")

    if tunnel:
        sauce_options["tunnelName"] = tunnel

    capabilities = {
        "platformName": os.getenv("SAUCE_PLATFORM", "Windows 11"),
        "browserName": os.getenv("SAUCE_BROWSER", "chrome"),
        "browserVersion": os.getenv("SAUCE_BROWSER_VERSION", "latest"),
        "sauce:options": sauce_options,
    }

    os.environ.setdefault(
        "SELENIUM_REMOTE_URL",
        f"https://ondemand.{region}.saucelabs.com:443/wd/hub",
    )

    os.environ["SELENIUM_REMOTE_CAPABILITIES"] = json.dumps(capabilities)


# Configurar Sauce Labs antes de que Playwright inicie el navegador.
if _usar_sauce():
    _configurar_entorno_sauce()


@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    """
    Configura el lanzamiento del navegador.

    En Sauce Labs utiliza modo headed.
    En local conserva la configuración original.
    """
    if _usar_sauce():
        return {
            **browser_type_launch_args,
            "headless": False,
        }

    return browser_type_launch_args


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    """
    Centraliza la configuración del contexto Playwright.

    Permite seleccionar la URL de la aplicación
    mediante la variable de entorno BASE_URL.
    """
    return {
        **browser_context_args,
        "base_url": os.getenv(
            "BASE_URL",
            "http://localhost:3000",
        ),
    }
