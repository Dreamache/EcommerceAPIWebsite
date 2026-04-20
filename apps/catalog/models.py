"""
Modulo de catalogo.

Decisoes de projeto:
- Slug gerado automaticamente a partir do nome; unicidade garantida com sufixo numerico
- Metodo reduce_stock e restore_stock centralizam a logica de estoque,
  evitando condicoes de corrida ao usar update_fields e select_for_update nos pedidos
- ProductImage.save() garante unicidade da imagem principal via update + exclude
- compare_price permite exibir o preco "de" sem logica no frontend
- Status OUT_OF_STOCK atualizado automaticamente ao zerar o estoque
"""

import logging

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify

logger = logging.getLogger(__name__)


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name='Nome')
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name='Descricao')
    image = models.ImageField(
        upload_to='categories/%Y/%m/',
        null=True,
        blank=True,
        verbose_name='Imagem',
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children',
        verbose_name='Categoria pai',
    )
    is_active = models.BooleanField(default=True, verbose_name='Ativa')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordem de exibicao')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['order', 'name']

    def __str__(self) -> str:
        if self.parent:
            return f'{self.parent} > {self.name}'
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)

    def _generate_unique_slug(self) -> str:
        base = slugify(self.name)
        slug = base
        counter = 1
        while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f'{base}-{counter}'
            counter += 1
        return slug


class Product(models.Model):

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Ativo'
        DRAFT = 'draft', 'Rascunho'
        OUT_OF_STOCK = 'out_of_stock', 'Sem estoque'
        DISCONTINUED = 'discontinued', 'Descontinuado'

    name = models.CharField(max_length=255, verbose_name='Nome')
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    sku = models.CharField(max_length=50, unique=True, verbose_name='SKU')
    description = models.TextField(blank=True, verbose_name='Descricao')
    short_description = models.CharField(
        max_length=300, blank=True, verbose_name='Descricao curta'
    )
    categories = models.ManyToManyField(
        Category,
        related_name='products',
        blank=True,
        verbose_name='Categorias',
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Preco',
    )
    compare_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name='Preco comparativo (de)',
    )
    cost_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name='Preco de custo',
    )
    stock = models.PositiveIntegerField(default=0, verbose_name='Estoque')
    min_stock_alert = models.PositiveIntegerField(
        default=5, verbose_name='Alerta de estoque minimo'
    )
    weight = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Peso (kg)',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        verbose_name='Status',
    )
    is_featured = models.BooleanField(default=False, verbose_name='Destaque')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['sku']),
            models.Index(fields=['status']),
            models.Index(fields=['is_featured', 'status']),
        ]

    def __str__(self) -> str:
        return f'{self.name} ({self.sku})'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)

    def _generate_unique_slug(self) -> str:
        base = slugify(self.name)
        slug = base
        counter = 1
        while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f'{base}-{counter}'
            counter += 1
        return slug

    @property
    def is_available(self) -> bool:
        return self.status == self.Status.ACTIVE and self.stock > 0

    @property
    def discount_percentage(self) -> float | None:
        if self.compare_price and self.compare_price > self.price:
            return round(
                ((self.compare_price - self.price) / self.compare_price) * 100, 1
            )
        return None

    @property
    def main_image(self):
        return self.images.filter(is_main=True).first() or self.images.first()

    def reduce_stock(self, quantity: int) -> None:
        """
        Reduz o estoque de forma segura.

        Deve ser chamado dentro de uma transacao atomica com select_for_update
        para evitar condicao de corrida em pedidos concorrentes.
        """
        if quantity <= 0:
            raise ValueError('A quantidade deve ser positiva.')
        if self.stock < quantity:
            raise ValueError(
                f'Estoque insuficiente para "{self.name}". '
                f'Disponivel: {self.stock}, solicitado: {quantity}.'
            )
        self.stock -= quantity
        if self.stock == 0:
            self.status = self.Status.OUT_OF_STOCK
        self.save(update_fields=['stock', 'status', 'updated_at'])

    def restore_stock(self, quantity: int) -> None:
        """Restaura estoque ao cancelar um pedido."""
        if quantity <= 0:
            raise ValueError('A quantidade deve ser positiva.')
        self.stock += quantity
        if self.status == self.Status.OUT_OF_STOCK and self.stock > 0:
            self.status = self.Status.ACTIVE
        self.save(update_fields=['stock', 'status', 'updated_at'])


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Produto',
    )
    image = models.ImageField(
        upload_to='products/%Y/%m/',
        verbose_name='Imagem',
    )
    alt_text = models.CharField(
        max_length=200, blank=True, verbose_name='Texto alternativo'
    )
    is_main = models.BooleanField(default=False, verbose_name='Imagem principal')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordem')

    class Meta:
        verbose_name = 'Imagem do produto'
        verbose_name_plural = 'Imagens do produto'
        ordering = ['-is_main', 'order']

    def __str__(self) -> str:
        flag = ' (principal)' if self.is_main else ''
        return f'Imagem de {self.product.name}{flag}'

    def save(self, *args, **kwargs):
        if self.is_main:
            # Garante unicidade da imagem principal no banco de forma atomica
            ProductImage.objects.filter(
                product=self.product, is_main=True
            ).exclude(pk=self.pk).update(is_main=False)
        super().save(*args, **kwargs)
