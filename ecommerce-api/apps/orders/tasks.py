"""
Tasks Celery para o modulo de pedidos.

Observacoes:
- bind=True permite acessar self para retentar a task em caso de falha
- max_retries=3 com exponential backoff via countdown evita sobrecarga no broker
- Importacoes de modelos dentro da funcao evitam importacao circular
  e garantem que o Django esta completamente inicializado quando a task executa
"""

import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_order_confirmation_email(self, order_id: int):
    """Envia e-mail de confirmacao ao cliente apos criacao do pedido."""
    try:
        from apps.orders.models import Order

        order = (
            Order.objects
            .select_related('user')
            .prefetch_related('items')
            .get(id=order_id)
        )

        items_text = '\n'.join(
            f'  {item.quantity}x {item.product_name}: R$ {item.line_total:.2f}'
            for item in order.items.all()
        )

        body = (
            f'Ola, {order.user.first_name or order.user.email}.\n\n'
            f'Seu pedido foi recebido com sucesso.\n\n'
            f'Pedido: {order.order_number}\n'
            f'Pagamento: {order.get_payment_method_display()}\n'
            f'Entrega: {order.shipping_address}\n\n'
            f'Itens:\n{items_text}\n\n'
            f'Subtotal: R$ {order.subtotal:.2f}\n'
            f'Frete: R$ {order.shipping_cost:.2f}\n'
            f'Total: R$ {order.total:.2f}\n\n'
            f'Obrigado pela compra.'
        )

        send_mail(
            subject=f'Pedido {order.order_number} recebido',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=False,
        )

        logger.info('E-mail de confirmacao enviado para pedido %s', order.order_number)

    except Exception as exc:
        logger.warning(
            'Falha ao enviar e-mail de confirmacao para pedido %d: %s',
            order_id, exc,
        )
        raise self.retry(exc=exc, countdown=2 ** self.request.retries * 60)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_order_status_update_email(self, order_id: int, new_status: str):
    """Envia e-mail quando o status do pedido e atualizado."""
    try:
        from apps.orders.models import Order

        order = Order.objects.select_related('user').get(id=order_id)

        status_messages = {
            'confirmed': 'foi confirmado e esta sendo preparado.',
            'processing': 'esta em processamento.',
            'shipped': f'foi enviado. Codigo de rastreio: {order.tracking_code or "em breve"}.',
            'delivered': 'foi entregue.',
            'cancelled': 'foi cancelado.',
            'refunded': 'foi reembolsado.',
        }

        detail = status_messages.get(new_status)
        if not detail:
            return  # Status sem notificacao configurada

        body = (
            f'Ola, {order.user.first_name or order.user.email}.\n\n'
            f'Seu pedido {order.order_number} {detail}\n\n'
            f'Para mais detalhes, acesse sua conta.'
        )

        send_mail(
            subject=f'Atualizacao do pedido {order.order_number}',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=False,
        )

    except Exception as exc:
        logger.warning(
            'Falha ao enviar e-mail de status para pedido %d: %s',
            order_id, exc,
        )
        raise self.retry(exc=exc, countdown=2 ** self.request.retries * 60)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def restore_stock_on_cancel(self, order_id: int):
    """
    Restaura o estoque de todos os produtos de um pedido cancelado.
    Executado via signal quando status muda para 'cancelled'.
    """
    try:
        from apps.orders.models import Order

        order = (
            Order.objects
            .prefetch_related('items__product')
            .get(id=order_id)
        )

        for item in order.items.all():
            if item.product:
                item.product.restore_stock(item.quantity)
                logger.info(
                    'Estoque restaurado: produto=%s, quantidade=%d, pedido=%s',
                    item.product_name, item.quantity, order.order_number,
                )

    except Exception as exc:
        logger.error(
            'Falha ao restaurar estoque para pedido %d: %s',
            order_id, exc,
        )
        raise self.retry(exc=exc, countdown=2 ** self.request.retries * 30)
