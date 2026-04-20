from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'product_sku', 'unit_price', 'quantity', 'line_total']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'payment_method', 'total', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__email', 'tracking_code']
    readonly_fields = [
        'order_number', 'subtotal', 'total', 'created_at',
        'updated_at', 'confirmed_at', 'shipped_at', 'delivered_at',
        'shipping_address',
    ]
    inlines = [OrderItemInline]
    fieldsets = (
        ('Identificacao', {'fields': ('order_number', 'user', 'status')}),
        ('Pagamento', {'fields': ('payment_method', 'payment_id')}),
        ('Entrega', {'fields': (
            'shipping_street', 'shipping_number', 'shipping_complement',
            'shipping_neighborhood', 'shipping_city', 'shipping_state',
            'shipping_zip_code', 'shipping_country',
            'tracking_code', 'shipping_address',
        )}),
        ('Valores', {'fields': ('subtotal', 'shipping_cost', 'discount', 'total')}),
        ('Observacoes', {'fields': ('notes', 'admin_notes')}),
        ('Datas', {'fields': ('created_at', 'updated_at', 'confirmed_at', 'shipped_at', 'delivered_at')}),
    )
