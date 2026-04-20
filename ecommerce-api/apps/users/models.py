"""
Modulo de usuarios.

Decisoes de projeto:
- AbstractUser extendido para manter compatibilidade com django.contrib.auth
- Email como campo de login (USERNAME_FIELD = 'email')
- UserProfile criado via signal post_save para garantir que todo usuario
  tenha perfil, sem necessidade de chamadas manuais
- Separacao entre dados de autenticacao (User) e dados de negocio (UserProfile)
"""

import logging

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)


class User(AbstractUser):
    email = models.EmailField(
        unique=True,
        verbose_name='E-mail',
        error_messages={'unique': 'Ja existe um usuario com este e-mail.'},
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Telefone',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    # username ainda e necessario pelo AbstractUser; mantemos mas nao o usamos como login
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        indexes = [
            models.Index(fields=['email']),
        ]

    def __str__(self) -> str:
        return self.email


class UserProfile(models.Model):
    """
    Perfil com endereco principal de entrega.

    Separado do User para permitir evolucao independente —
    ex: adicionar multiplos enderecos no futuro sem tocar no modelo de auth.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='Usuario',
    )
    street = models.CharField(max_length=255, blank=True, verbose_name='Rua')
    number = models.CharField(max_length=20, blank=True, verbose_name='Numero')
    complement = models.CharField(max_length=100, blank=True, verbose_name='Complemento')
    neighborhood = models.CharField(max_length=100, blank=True, verbose_name='Bairro')
    city = models.CharField(max_length=100, blank=True, verbose_name='Cidade')
    state = models.CharField(max_length=2, blank=True, verbose_name='Estado (UF)')
    zip_code = models.CharField(max_length=9, blank=True, verbose_name='CEP')
    country = models.CharField(max_length=50, default='Brasil', verbose_name='Pais')
    birth_date = models.DateField(null=True, blank=True, verbose_name='Data de nascimento')
    avatar = models.ImageField(
        upload_to='avatars/%Y/%m/',
        null=True,
        blank=True,
        verbose_name='Avatar',
    )
    newsletter = models.BooleanField(default=True, verbose_name='Receber newsletter')

    class Meta:
        verbose_name = 'Perfil do usuario'
        verbose_name_plural = 'Perfis dos usuarios'

    def __str__(self) -> str:
        return f'Perfil de {self.user.email}'

    @property
    def full_address(self) -> str:
        parts = [
            f'{self.street}, {self.number}' if self.street and self.number else '',
            self.complement,
            self.neighborhood,
            f'{self.city} - {self.state}' if self.city and self.state else '',
            self.zip_code,
            self.country,
        ]
        return ', '.join(p for p in parts if p)

    @property
    def has_complete_address(self) -> bool:
        """Verifica se o perfil tem todos os campos obrigatorios de endereco."""
        required = [self.street, self.number, self.neighborhood,
                    self.city, self.state, self.zip_code]
        return all(required)


# --------------------------------------------------------------------------
# Signals
# --------------------------------------------------------------------------

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Cria o UserProfile automaticamente na criacao do User.
    get_or_create usado de forma defensiva para evitar IntegrityError
    em casos de importacao de dados em lote.
    """
    if created:
        UserProfile.objects.get_or_create(user=instance)
        logger.info('Perfil criado para o usuario %s', instance.email)
