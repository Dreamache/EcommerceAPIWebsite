"""
Serializers de usuarios.

Observacoes de seguranca:
- Campos de senha sempre write_only
- validate_password aplica todas as regras configuradas em AUTH_PASSWORD_VALIDATORS
- Nao expor campos internos como is_staff, is_superuser, last_login
- RegisterSerializer nao retorna a senha nem hash no response
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import UserProfile

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    full_address = serializers.ReadOnlyField()
    has_complete_address = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = [
            'street', 'number', 'complement', 'neighborhood',
            'city', 'state', 'zip_code', 'country',
            'birth_date', 'avatar', 'newsletter',
            'full_address', 'has_complete_address',
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name',
            'last_name', 'phone', 'profile', 'created_at',
        ]
        read_only_fields = ['id', 'email', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    """
    Registro de novo usuario.

    password2 e removido antes da criacao — existe apenas para validacao
    no lado do servidor e nunca e persistido.
    """

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        validators=[validate_password],
        style={'input_type': 'password'},
    )
    password2 = serializers.CharField(
        write_only=True,
        label='Confirmacao de senha',
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name',
            'last_name', 'phone', 'password', 'password2',
        ]

    def validate_email(self, value: str) -> str:
        return value.lower().strip()

    def validate(self, attrs: dict) -> dict:
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError(
                {'password': 'As senhas informadas nao conferem.'}
            )
        return attrs

    def create(self, validated_data: dict) -> User:
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
    )
    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        validators=[validate_password],
        style={'input_type': 'password'},
    )
    new_password2 = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
    )

    def validate_old_password(self, value: str) -> str:
        user = self.context['request'].user
        if not user.check_password(value):
            # Mensagem generica — nao informar se o usuario existe ou nao
            raise serializers.ValidationError('Senha atual incorreta.')
        return value

    def validate(self, attrs: dict) -> dict:
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {'new_password': 'As senhas informadas nao conferem.'}
            )
        return attrs

    def save(self, **kwargs) -> User:
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password', 'updated_at'])
        return user
