import logging

from django_filters import rest_framework as django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order
from .serializers import CreateOrderSerializer, OrderAdminSerializer, OrderSerializer, UpdateOrderStatusSerializer

logger = logging.getLogger(__name__)


class OrderFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Order.Status.choices)
    start_date = django_filters.DateFilter(field_name='created_at', lookup_expr='date__gte')
    end_date = django_filters.DateFilter(field_name='created_at', lookup_expr='date__lte')
    min_total = django_filters.NumberFilter(field_name='total', lookup_expr='gte')
    max_total = django_filters.NumberFilter(field_name='total', lookup_expr='lte')

    class Meta:
        model = Order
        fields = ['status', 'payment_method']


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet de pedidos.

    Usuarios autenticados veem apenas seus proprios pedidos.
    Staff ve todos os pedidos.
    Edicao direta via PUT/PATCH nao e permitida; status e alterado
    exclusivamente via action update_status.
    """

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = OrderFilter
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        qs = Order.objects.prefetch_related('items__product').select_related('user')
        if self.request.user.is_staff:
            return qs.all()
        return qs.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        if self.action == 'update_status':
            return UpdateOrderStatusSerializer
        # Staff recebe OrderAdminSerializer que inclui admin_notes e payment_id.
        # Usuarios comuns recebem OrderSerializer (sem dados internos).
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return OrderAdminSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(
            data=request.data,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        logger.info(
            'Pedido criado: %s, usuario: %s, total: %s',
            order.order_number, request.user.email, order.total,
        )

        return Response(
            OrderSerializer(order, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        POST /api/v1/orders/{id}/cancel/
        Disponivel para o proprio usuario enquanto o pedido nao foi enviado.
        """
        order = self.get_object()

        if not order.can_cancel():
            return Response(
                {
                    'detail': (
                        f'Nao e possivel cancelar um pedido com '
                        f'status "{order.get_status_display()}".'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = Order.Status.CANCELLED
        order.save(update_fields=['status', 'updated_at'])

        logger.info('Pedido cancelado: %s por %s', order.order_number, request.user.email)

        return Response(OrderSerializer(order, context={'request': request}).data)

    @action(
        detail=True,
        methods=['patch'],
        url_path='update-status',
        permission_classes=[permissions.IsAdminUser],
    )
    def update_status(self, request, pk=None):
        """
        PATCH /api/v1/orders/{id}/update-status/
        Exclusivo para staff.
        """
        order = self.get_object()
        serializer = UpdateOrderStatusSerializer(
            instance=order,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        logger.info(
            'Status do pedido %s atualizado para %s por %s',
            order.order_number, order.status, request.user.email,
        )

        return Response(OrderSerializer(order, context={'request': request}).data)

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[permissions.IsAdminUser],
    )
    def dashboard(self, request):
        """
        GET /api/v1/orders/dashboard/
        Estatisticas agregadas para uso administrativo.
        """
        from datetime import timedelta

        from django.db.models import Avg, Count, Sum
        from django.utils import timezone

        thirty_days_ago = timezone.now() - timedelta(days=30)

        totals = Order.objects.aggregate(
            total_orders=Count('id'),
            total_revenue=Sum('total'),
            avg_order_value=Avg('total'),
        )

        recent = Order.objects.filter(created_at__gte=thirty_days_ago).aggregate(
            recent_orders=Count('id'),
            recent_revenue=Sum('total'),
        )

        by_status = {
            row['status']: row['count']
            for row in Order.objects.values('status').annotate(count=Count('id'))
        }

        return Response({
            'totals': totals,
            'last_30_days': recent,
            'by_status': by_status,
        })
