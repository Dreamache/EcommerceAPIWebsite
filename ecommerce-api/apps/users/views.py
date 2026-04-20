"""
Views de autenticacao e perfil.

Observacoes de seguranca:
- RegisterView e LoginView usam throttles dedicados (10/min e 20/hora) alem do global
- Logout invalida o refresh token via blacklist do SimpleJWT;
  o access token continuara valido ate expirar (comportamento esperado para JWT stateless)
- LogoutView captura excecoes especificas em vez de Exception generica
- Mensagens de erro sao genericas para nao revelar se o email existe no sistema
"""

import logging

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import UserProfile
from .serializers import (
    ChangePasswordSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    UserSerializer,
)
from .throttles import LoginRateThrottle, RegisterRateThrottle

logger = logging.getLogger(__name__)
User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    POST /api/v1/auth/register/

    Cria novo usuario e retorna tokens JWT para login imediato.
    Throttle: 20 tentativas por hora por IP.
    """

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RegisterRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        logger.info('Novo usuario registrado: %s', user.email)

        return Response(
            {
                'user': UserSerializer(user, context={'request': request}).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """
    POST /api/v1/auth/login/

    Override do TokenObtainPairView para aplicar throttle dedicado.
    Throttle: 10 tentativas por minuto por IP.
    """
    throttle_classes = [LoginRateThrottle]


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET/PATCH /api/v1/auth/me/

    Retorna e atualiza dados do usuario autenticado.
    """

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_object(self):
        return self.request.user


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET/PATCH /api/v1/auth/profile/

    Retorna e atualiza o perfil e endereco do usuario autenticado.
    """

    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class ChangePasswordView(APIView):
    """
    POST /api/v1/auth/change-password/

    Exige a senha atual antes de permitir a troca.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        logger.info('Senha alterada para o usuario %s', request.user.email)
        return Response({'detail': 'Senha alterada com sucesso.'})


class LogoutView(APIView):
    """
    POST /api/v1/auth/logout/

    Invalida o refresh token colocando-o na blacklist.
    O access token expirara naturalmente (padrao JWT stateless).
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': 'O campo "refresh" e obrigatorio.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except (TokenError, InvalidToken):
            return Response(
                {'detail': 'Token invalido ou ja expirado.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({'detail': 'Logout realizado com sucesso.'})
