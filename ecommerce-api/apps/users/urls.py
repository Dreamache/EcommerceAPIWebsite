from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='auth-register'),
    # LoginView customizada aplica throttle de 10 tentativas/minuto
    path('login/', views.LoginView.as_view(), name='auth-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),
    path('logout/', views.LogoutView.as_view(), name='auth-logout'),
    path('me/', views.MeView.as_view(), name='auth-me'),
    path('profile/', views.ProfileView.as_view(), name='auth-profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='auth-change-password'),
]
