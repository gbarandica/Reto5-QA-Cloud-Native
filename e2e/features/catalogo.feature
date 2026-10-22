Feature: Consulta del catálogo de productos
  Como cliente de la tienda
  Quiero visualizar los productos disponibles
  Para conocer las opciones de compra

  Scenario: Visualizar productos del catálogo
    Given que el cliente ingresa al catálogo
    When se cargan los productos de la tienda
    Then debe visualizar 25 productos

  Scenario: Buscar un producto por nombre
    Given que el cliente ingresa al catálogo
    When busca un producto por su nombre
    Then debe visualizar únicamente productos que coincidan con la búsqueda