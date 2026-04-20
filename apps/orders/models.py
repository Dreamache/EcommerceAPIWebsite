"""
Modulo de pedidos.

Decisoes de projeto:
- OrderItem armazena snapshot de nome, SKU e preco no momento da compra;
  isso garante imutabilidade historica mesmo que o produto seja alterado depois
- order_number gerado pos-save para incluir o ID do registro no formato legivel
- Signal post_save dispara tasks Celery de forma desacoplada;
  a logica de negocio nao conhece a camada de notificacao
- Status CANCELLED aciona restauracao de estoque via task assincrona
- can_cancel() centraliza a regra de negocio de cancelamento

Observacao de seguranca:
- O metodo create() do serializer usa select_for_update() nos produtos
  para evitar condicao de corrida em pedidos concorrentes que disputam
  o mesmo estoque
"""

import logging

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.catalog.models import Product

logger = logging.getLogger(__name__)


class Order(models.Model):

    class Status(models.TextChoices):
        PENDING = 'pending', 'Aguardando pagamento'
        CONFIRMED = 'confirmed', 'Confirmado'
        PROCESSING = 'processing', 'Em processamento'
        SHIPPED = 'shipped', 'Enviado'
        DELIVERED = 'delivered', 'Entregue'
        CANCELLED = 'cancelled', 'Cancelado'
        REFUNDED = 'refunded', 'Reembolsado'

    class PaymentMethod(models.TextChoices):
        CREDIT_CARD = 'credit_card', 'Cartao de credito'
        DEBIT_CARD = 'debit_card', 'Cartao de debito'
        PIX = 'pix', 'PIX'
        BOLETO = 'boleto', 'Boleto bancario'

    # Relacoes
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='Usuario',
    )
    order_number = models.CharField(
        max_length=20, unique=True, blank=True, verbose_name='Numero do pedido'
    )

    # Status e pagamento
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name='Status',
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        verbose_name='Forma de pagamento',
    )
    payment_id = models.CharField(
        max_length=100, blank=True, verbose_name='ID do pagamento (gateway)'
    )

    # Snapshot do endereco de entrega
    shipping_street = models.CharField(max_length=255, verbose_name='Rua')
    shipping_number = models.CharField(max_length=20, verbose_name='Numero')
    shipping_complement = models.CharField(max_length=100, blank=True, verbose_name='Complemento')
    shipping_neighborhood = models.CharField(max_length=100, verbose_name='Bairro')
    shipping_city = models.CharField(max_length=100, verbose_name='Cidade')
    shipping_state = models.CharField(max_length=2, verbose_name='Estado')
    shipping_zip_code = models.CharField(max_length=9, verbose_name='CEP')
    shipping_country = models.CharField(max_length=50, default='Brasil', verbose_name='Pais')

    # Valores
    subtotal = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Subtotal',
    )
    shipping_cost = models.DecimalField(
        max_digits=8, decimal_places=2, default=0,
        validators=[MinValueValidator(0)],
        verbose_name='Frete',
    )
    discount = models.DecimalField(
        max_digits=8, decimal_places=2, default=0,
        validators=[MinValueValidator(0)],
        verbose_name='Desconto',
    )
    total = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Total',
    )

    notes = models.TextField(blank=True, verbose_name='Observacoes do cliente')
    admin_notes = models.TextField(blank=True, verbose_name='Notas internas')
    tracking_code = models.CharField(max_length=50, blank=True, verbose_name='Codigo de rastreio')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self) -> str:
        return f'Pedido {self.order_number} - {self.user.email}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Gera o numero legivel apos o primeiro save (quando o ID ja existe)
        if not self.order_number:
            self.order_number = f'ORD-{self.created_at.year}-{self.id:05d}'
            Order.objects.filter(pk=self.pk).update(order_number=self.order_number)

    @property
    def shipping_address(self) -> str:
        parts = [
            f'{self.shipping_street}, {self.shipping_number}',
            self.shipping_complement,
            self.shipping_neighborhood,
            f'{self.shipping_city} - {self.shipping_state}',
            self.shipping_zip_code,
        ]
        return ', '.join(p for p in parts if p)

    def can_cancel(self) -> bool:
        return self.status in [
            self.Status.PENDING,
            self.Status.CONFIRMED,
            self.Status.PROCESSING,
        ]


class OrderItem(models.Model):
    """
    Item de pedido com snapshot imutavel.

    product pode ser NULL caso o produto seja removido do sistema;
    os campos de snapshot garantem que o historico permanece integro.
    """

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Pedido',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name='order_items',
        verbose_name='Produto',
    )
    # Snapshot
    product_name = models.CharField(max_length=255, verbose_name='Nome do produto')
    product_sku = models.CharField(max_length=50, verbose_name='SKU')
    unit_price = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name='Preco unitario'
    )
    quantity = models.PositiveIntegerField(verbose_name='Quantidade')

    class Meta:
        verbose_name = 'Item do pedido'
        verbose_name_plural = 'Itens do pedido'

    def __str__(self) -> str:
        return f'{self.quantity}x {self.product_name}'

    @property
    def line_total(self):
        return self.unit_price * self.quantity


# --------------------------------------------------------------------------
# Signals
# --------------------------------------------------------------------------

@receiver(post_save, sender=Order)
def handle_order_post_save(sender, instance, created, **kwargs):
    """
    Dispara tasks assincronas desacopladas da transacao principal.

    Importacao local das tasks evita importacao circular entre
    orders.models e orders.tasks.
    """
    from apps.orders.tasks import (
        restore_stock_on_cancel,
        send_order_confirmation_email,
        send_order_status_update_email,
    )

    if created:
        send_order_confirmation_email.delay(instance.id)
        logger.info('Task de confirmacao enfileirada para pedido %s', instance.order_number)
    else:
        send_order_status_update_email.delay(instance.id, instance.status)
        if instance.status == Order.Status.CANCELLED:
            restore_stock_on_cancel.delay(instance.id)
            logger.info('Task de restauracao de estoque enfileirada para pedido %s', instance.order_number)
