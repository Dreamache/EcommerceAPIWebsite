"""
Serializers de pedidos.

Seguranca:
- admin_notes e um campo interno de operacoes. E removido do OrderSerializer
  publico e exposto apenas em OrderAdminSerializer, usado nas views de staff.
- CreateOrderSerializer.create() usa importacao direta (sem __import__) e
  select_for_update() para evitar condicao de corrida no estoque.
- notes tem max_length=500 para prevenir payloads abusivos.
- Todos os campos de endereco tem max_length explicitamente definidos.
"""

from django.db import transaction
from rest_framework import serializers

from apps.cart.models import Cart
from apps.catalog.models import Product

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_sku',
            'unit_price', 'quantity', 'line_total',
        ]


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer publico de pedido — visivel ao proprio usuario.

    SEGURANCA: admin_notes e omitido intencionalmente. Esse campo contem
    anotacoes internas da equipe de operacoes e nao deve ser exposto ao cliente.
    Use OrderAdminSerializer nas views restritas a staff.
    """
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(
        source='get_payment_method_display', read_only=True
    )
    shipping_address = serializers.ReadOnlyField()
    can_cancel = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'payment_method', 'payment_method_display',
            'shipping_street', 'shipping_number', 'shipping_complement',
            'shipping_neighborhood', 'shipping_city', 'shipping_state',
            'shipping_zip_code', 'shipping_country', 'shipping_address',
            'subtotal', 'shipping_cost', 'discount', 'total',
            'notes', 'tracking_code', 'items',
            'can_cancel', 'created_at', 'updated_at',
            'confirmed_at', 'shipped_at', 'delivered_at',
        ]
        read_only_fields = [
            'order_number', 'subtotal', 'total', 'created_at',
            'updated_at', 'confirmed_at', 'shipped_at', 'delivered_at',
        ]


class OrderAdminSerializer(OrderSerializer):
    """
    Serializer estendido para staff.
    Inclui admin_notes e payment_id (ID do gateway de pagamento).
    Usado apenas em views com permission_classes=[IsAdminUser].
    """

    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + ['admin_notes', 'payment_id']


class CreateOrderSerializer(serializers.Serializer):
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)

    # max_length evita payloads abusivos no campo de observacoes
    notes = serializers.CharField(
        required=False, allow_blank=True, default='', max_length=500
    )

    shipping_street = serializers.CharField(max_length=255)
    shipping_number = serializers.CharField(max_length=20)
    shipping_complement = serializers.CharField(
        max_length=100, required=False, allow_blank=True, default=''
    )
    shipping_neighborhood = serializers.CharField(max_length=100)
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=2)
    shipping_zip_code = serializers.CharField(max_length=9)
    shipping_country = serializers.CharField(max_length=50, default='Brasil')

    def validate(self, attrs):
        user = self.context['request'].user

        try:
            cart = Cart.objects.prefetch_related('items__product').get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError('Carrinho nao encontrado.')

        if not cart.items.exists():
            raise serializers.ValidationError('O carrinho esta vazio.')

        errors = []
        for item in cart.items.all():
            if not item.product.is_available:
                errors.append(f'"{item.product.name}" nao esta mais disponivel.')
            elif item.quantity > item.product.stock:
                errors.append(
                    f'Estoque insuficiente para "{item.product.name}". '
                    f'Disponivel: {item.product.stock}, solicitado: {item.quantity}.'
                )
        if errors:
            raise serializers.ValidationError(errors)

        attrs['cart'] = cart
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        cart = validated_data.pop('cart')
        user = self.context['request'].user

        # Importacao direta em vez de __import__ — mais legivel e igualmente segura
        product_ids = list(cart.items.values_list('product_id', flat=True))
        locked_products = {
            p.id: p
            for p in Product.objects.select_for_update().filter(id__in=product_ids)
        }

        subtotal = cart.subtotal
        shipping_cost = validated_data.pop('shipping_cost', 0)
        discount = validated_data.pop('discount', 0)
        total = subtotal + shipping_cost - discount

        order = Order.objects.create(
            user=user,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            discount=discount,
            total=total,
            **validated_data,
        )

        for cart_item in cart.items.select_related('product').all():
            product = locked_products[cart_item.product_id]
            product.reduce_stock(cart_item.quantity)

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_sku=product.sku,
                unit_price=product.price,
                quantity=cart_item.quantity,
            )

        cart.clear()
        return order


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.Status.choices)
    tracking_code = serializers.CharField(required=False, allow_blank=True, max_length=50)
    admin_notes = serializers.CharField(required=False, allow_blank=True, max_length=1000)

    def update(self, instance, validated_data):
        from django.utils import timezone

        new_status = validated_data['status']
        instance.status = new_status

        if validated_data.get('tracking_code'):
            instance.tracking_code = validated_data['tracking_code']
        if validated_data.get('admin_notes'):
            instance.admin_notes = validated_data['admin_notes']

        now = timezone.now()
        if new_status == Order.Status.CONFIRMED and not instance.confirmed_at:
            instance.confirmed_at = now
        elif new_status == Order.Status.SHIPPED and not instance.shipped_at:
            instance.shipped_at = now
        elif new_status == Order.Status.DELIVERED and not instance.delivered_at:
            instance.delivered_at = now

        instance.save()
        return instance
