Feature: Gestión del carrito de compras
  Como cliente de la tienda
  Quiero agregar productos al carrito
  Para preparar mi compra antes de confirmar el pedido

  Scenario: Agregar un producto al carrito
    Given que el cliente ingresa al catálogo
    When selecciona un producto disponible
    And agrega una unidad al carrito
    And abre el carrito de compras
    Then debe visualizar el producto agregado con cantidad uno