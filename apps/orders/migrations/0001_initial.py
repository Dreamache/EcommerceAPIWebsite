import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('catalog', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.CharField(blank=True, max_length=20, unique=True, verbose_name='Numero do pedido')),
                ('status', models.CharField(
                    choices=[
                        ('pending', 'Aguardando pagamento'),
                        ('confirmed', 'Confirmado'),
                        ('processing', 'Em processamento'),
                        ('shipped', 'Enviado'),
                        ('delivered', 'Entregue'),
                        ('cancelled', 'Cancelado'),
                        ('refunded', 'Reembolsado'),
                    ],
                    default='pending',
                    max_length=20,
                    verbose_name='Status',
                )),
                ('payment_method', models.CharField(
                    choices=[
                        ('credit_card', 'Cartao de credito'),
                        ('debit_card', 'Cartao de debito'),
                        ('pix', 'PIX'),
                        ('boleto', 'Boleto bancario'),
                    ],
                    max_length=20,
                    verbose_name='Forma de pagamento',
                )),
                ('payment_id', models.CharField(blank=True, max_length=100, verbose_name='ID do pagamento (gateway)')),
                ('shipping_street', models.CharField(max_length=255, verbose_name='Rua')),
                ('shipping_number', models.CharField(max_length=20, verbose_name='Numero')),
                ('shipping_complement', models.CharField(blank=True, max_length=100, verbose_name='Complemento')),
                ('shipping_neighborhood', models.CharField(max_length=100, verbose_name='Bairro')),
                ('shipping_city', models.CharField(max_length=100, verbose_name='Cidade')),
                ('shipping_state', models.CharField(max_length=2, verbose_name='Estado')),
                ('shipping_zip_code', models.CharField(max_length=9, verbose_name='CEP')),
                ('shipping_country', models.CharField(default='Brasil', max_length=50, verbose_name='Pais')),
                ('subtotal', models.DecimalField(
                    decimal_places=2,
                    max_digits=10,
                    validators=[django.core.validators.MinValueValidator(0)],
                    verbose_name='Subtotal',
                )),
                ('shipping_cost', models.DecimalField(
                    decimal_places=2,
                    default=0,
                    max_digits=8,
                    validators=[django.core.validators.MinValueValidator(0)],
                    verbose_name='Frete',
                )),
                ('discount', models.DecimalField(
                    decimal_places=2,
                    default=0,
                    max_digits=8,
                    validators=[django.core.validators.MinValueValidator(0)],
                    verbose_name='Desconto',
                )),
                ('total', models.DecimalField(
                    decimal_places=2,
                    max_digits=10,
                    validators=[django.core.validators.MinValueValidator(0)],
                    verbose_name='Total',
                )),
                ('notes', models.TextField(blank=True, verbose_name='Observacoes do cliente')),
                ('admin_notes', models.TextField(blank=True, verbose_name='Notas internas')),
                ('tracking_code', models.CharField(blank=True, max_length=50, verbose_name='Codigo de rastreio')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('confirmed_at', models.DateTimeField(blank=True, null=True)),
                ('shipped_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.PROTECT,
                    related_name='orders',
                    to=settings.AUTH_USER_MODEL,
                    verbose_name='Usuario',
                )),
            ],
            options={
                'verbose_name': 'Pedido',
                'verbose_name_plural': 'Pedidos',
                'ordering': ['-created_at'],
                'indexes': [
                    models.Index(fields=['order_number'], name='orders_order_number_idx'),
                    models.Index(fields=['user', 'status'], name='orders_user_status_idx'),
                    models.Index(fields=['status', 'created_at'], name='orders_status_created_idx'),
                ],
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=255, verbose_name='Nome do produto')),
                ('product_sku', models.CharField(max_length=50, verbose_name='SKU')),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Preco unitario')),
                ('quantity', models.PositiveIntegerField(verbose_name='Quantidade')),
                ('order', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='items',
                    to='orders.order',
                    verbose_name='Pedido',
                )),
                ('product', models.ForeignKey(
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='order_items',
                    to='catalog.product',
                    verbose_name='Produto',
                )),
            ],
            options={
                'verbose_name': 'Item do pedido',
                'verbose_name_plural': 'Itens do pedido',
            },
        ),
    ]
