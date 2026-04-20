"""
Views do catalogo de produtos.

Observacoes tecnicas:
- get_queryset aplica select_related e prefetch_related em todos os casos
  para evitar N+1 queries
- adjust_stock usa select_for_update dentro de uma transacao para evitar
  condicao de corrida em atualizacoes concorrentes de estoque
- Usuarios nao autenticados e nao-staff veem apenas produtos com status 'active'
- upload_images valida extensao do arquivo antes de persistir
"""

import logging

from django.db import transaction
from django_filters import rest_framework as django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .models import Category, Product, ProductImage
from .permissions import IsAdminOrReadOnly
from .serializers import (
    CategorySerializer,
    ProductAdminSerializer,
    ProductDetailSerializer,
    ProductImageSerializer,
    ProductListSerializer,
)

logger = logging.getLogger(__name__)

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category = django_filters.CharFilter(method='filter_by_category')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')

    class Meta:
        model = Product
        fields = ['status', 'is_featured']

    def filter_by_category(self, queryset, name, value):
        return queryset.filter(
            categories__slug=value
        ).distinct()

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0, status='active')
        return queryset.filter(stock=0)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD de categorias.
    Retorna apenas categorias raiz; filhos vem aninhados no campo 'children'.
    """

    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        return (
            Category.objects
            .filter(parent=None, is_active=True)
            .prefetch_related('children', 'children__children')
        )

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """
        GET /api/v1/catalog/categories/{slug}/products/
        Lista produtos da categoria e de todas as subcategorias diretas.
        """
        category = self.get_object()
        child_ids = list(category.children.values_list('id', flat=True))
        category_ids = [category.id] + child_ids

        qs = (
            Product.objects
            .filter(categories__id__in=category_ids, status='active')
            .distinct()
            .prefetch_related('images', 'categories')
        )

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = ProductListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = ProductListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """
    CRUD de produtos com filtros, busca e ordenacao.

    Acoes customizadas:
    - upload_images : faz upload de imagens para o produto (admin)
    - adjust_stock  : ajuste manual de estoque com lock otimista (admin)
    - featured      : lista produtos em destaque
    - low_stock     : lista produtos abaixo do estoque minimo (admin)
    """

    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'sku', 'description', 'short_description']
    ordering_fields = ['price', 'created_at', 'stock', 'name']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Product.objects.prefetch_related('images', 'categories')
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            qs = qs.filter(status='active')
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        # Staff recebe ProductAdminSerializer que inclui cost_price.
        # Usuarios comuns recebem ProductDetailSerializer (sem cost_price).
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return ProductAdminSerializer
        return ProductDetailSerializer

    @action(
        detail=True,
        methods=['post'],
        url_path='upload-images',
        permission_classes=[permissions.IsAdminUser],
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_images(self, request, slug=None):
        """
        POST /api/v1/catalog/products/{slug}/upload-images/
        Aceita multiplos arquivos no campo 'images'.
        Valida extensao antes de salvar.
        """
        product = self.get_object()
        files = request.FILES.getlist('images')

        if not files:
            return Response(
                {'detail': 'Nenhuma imagem enviada.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        created = []
        errors = []

        for index, file in enumerate(files):
            suffix = '.' + file.name.rsplit('.', 1)[-1].lower() if '.' in file.name else ''
            if suffix not in ALLOWED_IMAGE_EXTENSIONS:
                errors.append(
                    f'{file.name}: extensao nao permitida. '
                    f'Use: {", ".join(ALLOWED_IMAGE_EXTENSIONS)}'
                )
                continue

            is_main = index == 0 and not product.images.exists()
            img = ProductImage.objects.create(
                product=product,
                image=file,
                is_main=is_main,
                order=product.images.count() + index,
            )
            created.append(ProductImageSerializer(img, context={'request': request}).data)

        response_data = {'created': created}
        if errors:
            response_data['errors'] = errors

        response_status = (
            status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST
        )
        return Response(response_data, status=response_status)

    @action(
        detail=True,
        methods=['patch'],
        url_path='adjust-stock',
        permission_classes=[permissions.IsAdminUser],
    )
    def adjust_stock(self, request, slug=None):
        """
        PATCH /api/v1/catalog/products/{slug}/adjust-stock/
        Ajusta estoque com select_for_update para evitar condicao de corrida.

        Body: { "quantity": 10 }  (positivo = entrada, negativo = saida)
        """
        quantity = request.data.get('quantity')

        if quantity is None:
            return Response(
                {'detail': 'O campo "quantity" e obrigatorio.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return Response(
                {'detail': 'O valor de "quantity" deve ser um numero inteiro.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Limite superior para prevenir valores absurdos (ex: 10 milhoes de unidades)
        MAX_ADJUSTMENT = 100_000
        if abs(quantity) > MAX_ADJUSTMENT:
            return Response(
                {'detail': f'Ajuste maximo permitido e de {MAX_ADJUSTMENT} unidades por operacao.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            # select_for_update bloqueia a linha ate o fim da transacao
            product = Product.objects.select_for_update().get(slug=slug)
            old_stock = product.stock
            new_stock = product.stock + quantity

            if new_stock < 0:
                return Response(
                    {'detail': f'Ajuste resultaria em estoque negativo. Estoque atual: {old_stock}.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            product.stock = new_stock
            if new_stock == 0 and product.status == Product.Status.ACTIVE:
                product.status = Product.Status.OUT_OF_STOCK
            elif new_stock > 0 and product.status == Product.Status.OUT_OF_STOCK:
                product.status = Product.Status.ACTIVE

            product.save(update_fields=['stock', 'status', 'updated_at'])

        logger.info(
            'Estoque ajustado: produto=%s, ajuste=%d, anterior=%d, novo=%d, usuario=%s',
            slug, quantity, old_stock, new_stock, request.user.email,
        )

        return Response({
            'old_stock': old_stock,
            'adjustment': quantity,
            'new_stock': new_stock,
        })

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """GET /api/v1/catalog/products/featured/"""
        qs = self.get_queryset().filter(is_featured=True, status='active')
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = ProductListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = ProductListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(
        detail=False,
        methods=['get'],
        url_path='low-stock',
        permission_classes=[permissions.IsAdminUser],
    )
    def low_stock(self, request):
        """
        GET /api/v1/catalog/products/low-stock/
        Lista produtos com estoque <= min_stock_alert.
        """
        from django.db.models import F

        qs = (
            self.get_queryset()
            .filter(stock__lte=F('min_stock_alert'), status='active')
            .order_by('stock')
        )
        serializer = ProductListSerializer(qs, many=True, context={'request': request})
        return Response({'count': qs.count(), 'results': serializer.data})
