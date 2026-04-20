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
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='cart',
                    to=settings.AUTH_USER_MODEL,
                    verbose_name='Usuario',
                )),
            ],
            options={
                'verbose_name': 'Carrinho',
                'verbose_name_plural': 'Carrinhos',
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(
                    default=1,
                    validators=[django.core.validators.MinValueValidator(1)],
                    verbose_name='Quantidade',
                )),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('cart', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='items',
                    to='cart.cart',
                    verbose_name='Carrinho',
                )),
                ('product', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='cart_items',
                    to='catalog.product',
                    verbose_name='Produto',
                )),
            ],
            options={
                'verbose_name': 'Item do carrinho',
                'verbose_name_plural': 'Itens do carrinho',
                'unique_together': {('cart', 'product')},
            },
        ),
    ]
