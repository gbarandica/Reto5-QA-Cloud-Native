Feature: Confirmación de pedidos
  Como cliente de la tienda
  Quiero confirmar los productos de mi carrito
  Para completar mi compra

  Scenario: Confirmar un pedido exitosamente
    Given que el cliente tiene un producto disponible en el carrito
    When confirma el pedido
    Then debe visualizar el mensaje de pedido confirmado
    And el carrito debe quedar vacío