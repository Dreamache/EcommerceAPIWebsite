from rest_framework import serializers

from apps.catalog.models import Product
from apps.catalog.serializers import ProductListSerializer

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(status='active'),
        write_only=True,
        source='product',
    )
    unit_price = serializers.ReadOnlyField()
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price', 'line_total', 'added_at']
        read_only_fields = ['added_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'subtotal', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    """Valida a adicao de um item ao carrinho."""

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(status='active'),
        source='product',
    )
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate(self, attrs):
        product = attrs['product']
        quantity = attrs['quantity']

        if not product.is_available:
            raise serializers.ValidationError(
                f'O produto "{product.name}" nao esta disponivel para compra.'
            )
        if quantity > product.stock:
            raise serializers.ValidationError(
                f'Quantidade solicitada ({quantity}) excede o estoque '
                f'disponivel ({product.stock}).'
            )
        return attrs


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)

    def validate_quantity(self, value):
        item = self.context.get('item')
        if item and value > item.product.stock:
            raise serializers.ValidationError(
                f'Estoque disponivel: {item.product.stock}.'
            )
        return value
