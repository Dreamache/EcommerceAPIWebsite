"""
Modulo de carrinho.

Decisoes de projeto:
- Um carrinho por usuario (OneToOneField); criado via get_or_create nas views
- unique_together em (cart, product) previne duplicidade no nivel do banco
- Validacao de estoque feita no serializer e na view; o model nao faz
  chamadas extras ao banco para nao penalizar leituras simples
- clear() usa delete() em batch, mais eficiente que iterar item por item
"""

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from apps.catalog.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
        verbose_name='Usuario',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Carrinho'
        verbose_name_plural = 'Carrinhos'

    def __str__(self) -> str:
        return f'Carrinho de {self.user.email}'

    @property
    def total_items(self) -> int:
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        return sum(item.line_total for item in self.items.all())

    def clear(self) -> None:
        self.items.all().delete()


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Carrinho',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items',
        verbose_name='Produto',
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name='Quantidade',
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Item do carrinho'
        verbose_name_plural = 'Itens do carrinho'
        unique_together = ('cart', 'product')

    def __str__(self) -> str:
        return f'{self.quantity}x {self.product.name}'

    @property
    def unit_price(self):
        return self.product.price

    @property
    def line_total(self):
        return self.unit_price * self.quantity
