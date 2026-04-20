"""
Throttles customizados para endpoints de autenticacao.

Os endpoints de login e registro sao os mais criticos para ataques de forca
bruta e credential stuffing. O throttle global (60/hour anonimo) e insuficiente
para esses casos porque permite 1 tentativa por minuto, o que ainda e exploravel.

LoginRateThrottle: 10 tentativas por minuto por IP.
RegisterRateThrottle: 20 tentativas por hora por IP.

Esses limites cobrem uso legitimo (usuario que erra a senha algumas vezes)
sem permitir automacao de ataques.
"""

from rest_framework.throttling import AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    """
    Throttle especifico para o endpoint de login.
    10 tentativas por minuto por IP — bloqueia forca bruta sem afetar usuarios reais.
    """
    scope = 'login'


class RegisterRateThrottle(AnonRateThrottle):
    """
    Throttle especifico para o endpoint de registro.
    20 tentativas por hora por IP — previne criacao automatizada de contas.
    """
    scope = 'register'
