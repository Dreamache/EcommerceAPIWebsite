from django.contrib import admin

from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_main', 'order']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active', 'order']
    list_filter = ['is_active', 'parent']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'price', 'stock', 'status', 'is_featured', 'created_at']
    list_filter = ['status', 'is_featured', 'categories']
    search_fields = ['name', 'sku', 'description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['categories']
    inlines = [ProductImageInline]
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Identificacao', {'fields': ('name', 'slug', 'sku', 'status', 'is_featured')}),
        ('Descricao', {'fields': ('description', 'short_description')}),
        ('Precos', {'fields': ('price', 'compare_price', 'cost_price')}),
        ('Estoque', {'fields': ('stock', 'min_stock_alert', 'weight')}),
        ('Categorias', {'fields': ('categories',)}),
        ('Datas', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'is_main', 'order']
    list_filter = ['is_main']
