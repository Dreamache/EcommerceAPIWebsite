import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Nome')),
                ('slug', models.SlugField(blank=True, max_length=120, unique=True)),
                ('description', models.TextField(blank=True, verbose_name='Descricao')),
                ('image', models.ImageField(blank=True, null=True, upload_to='categories/%Y/%m/', verbose_name='Imagem')),
                ('is_active', models.BooleanField(default=True, verbose_name='Ativa')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Ordem de exibicao')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('parent', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='children',
                    to='catalog.category',
                    verbose_name='Categoria pai',
                )),
            ],
            options={
                'verbose_name': 'Categoria',
                'verbose_name_plural': 'Categorias',
                'ordering': ['order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Nome')),
                ('slug', models.SlugField(blank=True, max_length=280, unique=True)),
                ('sku', models.CharField(max_length=50, unique=True, verbose_name='SKU')),
                ('description', models.TextField(blank=True, verbose_name='Descricao')),
                ('short_description', models.CharField(blank=True, max_length=300, verbose_name='Descricao curta')),
                ('price', models.DecimalField(
                    decimal_places=2,
                    max_digits=10,
                    validators=[django.core.validators.MinValueValidator(0)],
                    verbose_name='Preco',
                )),
                ('compare_price', models.DecimalField(
                    blank=True,
                    decimal_places=2,
                    max_digits=10,
                    null=True,
                    validators=[django.core.validators.MinValueValidator(0)],
                    verbose_name='Preco comparativo (de)',
                )),
                ('cost_price', models.DecimalField(
                    blank=True,
                    decimal_places=2,
                    max_digits=10,
                    null=True,
                    validators=[django.core.validators.MinValueValidator(0)],
                    verbose_name='Preco de custo',
                )),
                ('stock', models.PositiveIntegerField(default=0, verbose_name='Estoque')),
                ('min_stock_alert', models.PositiveIntegerField(default=5, verbose_name='Alerta de estoque minimo')),
                ('weight', models.DecimalField(
                    blank=True,
                    decimal_places=2,
                    max_digits=6,
                    null=True,
                    verbose_name='Peso (kg)',
                )),
                ('status', models.CharField(
                    choices=[
                        ('active', 'Ativo'),
                        ('draft', 'Rascunho'),
                        ('out_of_stock', 'Sem estoque'),
                        ('discontinued', 'Descontinuado'),
                    ],
                    default='draft',
                    max_length=20,
                    verbose_name='Status',
                )),
                ('is_featured', models.BooleanField(default=False, verbose_name='Destaque')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('categories', models.ManyToManyField(
                    blank=True,
                    related_name='products',
                    to='catalog.category',
                    verbose_name='Categorias',
                )),
            ],
            options={
                'verbose_name': 'Produto',
                'verbose_name_plural': 'Produtos',
                'ordering': ['-created_at'],
                'indexes': [
                    models.Index(fields=['slug'], name='catalog_product_slug_idx'),
                    models.Index(fields=['sku'], name='catalog_product_sku_idx'),
                    models.Index(fields=['status'], name='catalog_product_status_idx'),
                    models.Index(fields=['is_featured', 'status'], name='catalog_product_featured_idx'),
                ],
            },
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='products/%Y/%m/', verbose_name='Imagem')),
                ('alt_text', models.CharField(blank=True, max_length=200, verbose_name='Texto alternativo')),
                ('is_main', models.BooleanField(default=False, verbose_name='Imagem principal')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Ordem')),
                ('product', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='images',
                    to='catalog.product',
                    verbose_name='Produto',
                )),
            ],
            options={
                'verbose_name': 'Imagem do produto',
                'verbose_name_plural': 'Imagens do produto',
                'ordering': ['-is_main', 'order'],
            },
        ),
    ]
