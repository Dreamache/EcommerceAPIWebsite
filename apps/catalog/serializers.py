"""
Serializers do catalogo.

Seguranca:
- cost_price e um dado interno de custo do produto. Nao deve ser exposto
  a usuarios comuns. ProductDetailSerializer o omite; o admin ve via
  ProductAdminSerializer usado exclusivamente nas views de staff.
"""

from rest_framework import serializers

from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'parent', 'is_active', 'order', 'children', 'products_count',
        ]

    def get_children(self, obj):
        qs = obj.children.filter(is_active=True)
        return CategorySerializer(qs, many=True, context=self.context).data

    def get_products_count(self, obj) -> int:
        return obj.products.filter(status='active').count()


class CategoryMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_main', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    """
    Serializer leve para listagens.
    Evita N+1 — requer prefetch_related('images', 'categories') na queryset.
    Nao expoe cost_price, status interno nem dados de admin.
    """

    main_image = ProductImageSerializer(read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    categories = CategoryMinimalSerializer(many=True, read_only=True)
    is_available = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description',
            'price', 'compare_price', 'discount_percentage',
            'stock', 'status', 'is_available', 'is_featured',
            'categories', 'main_image', 'created_at',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Serializer publico para detalhe do produto.

    SEGURANCA: cost_price e omitido intencionalmente. Esse campo e dado
    interno de margem/custo e nao deve ser visivel a clientes.
    Use ProductAdminSerializer nas views restritas a staff.
    """
    images = ProductImageSerializer(many=True, read_only=True)
    categories = CategoryMinimalSerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all(),
        write_only=True,
        source='categories',
    )
    discount_percentage = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'short_description',
            'price', 'compare_price', 'discount_percentage',
            'stock', 'min_stock_alert', 'weight',
            'status', 'is_available', 'is_featured',
            'categories', 'category_ids', 'images',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def validate(self, attrs):
        compare_price = attrs.get('compare_price')
        price = attrs.get('price')
        if compare_price is not None and price is not None:
            if compare_price <= price:
                raise serializers.ValidationError(
                    {'compare_price': 'O preco comparativo deve ser maior que o preco atual.'}
                )
        return attrs


class ProductAdminSerializer(ProductDetailSerializer):
    """
    Serializer estendido exclusivamente para staff/admin.
    Inclui cost_price e outros campos internos.
    Usado apenas em views com permission_classes=[IsAdminUser].
    """

    class Meta(ProductDetailSerializer.Meta):
        fields = ProductDetailSerializer.Meta.fields + ['cost_price']
