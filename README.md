# E-commerce API

API REST de e-commerce construída com Django REST Framework. O sistema cobre o ciclo completo de compra: catálogo de produtos com categorias hierárquicas, carrinho por usuário, criação de pedidos com transação atômica e notificações assíncronas por e-mail.

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Django | 4.2 | Framework web |
| Django REST Framework | 3.14 | Camada REST |
| SimpleJWT | 5.3 | Autenticação JWT |
| PostgreSQL | 15 | Banco de dados principal |
| Redis | 7 | Cache e broker do Celery |
| Celery | 5.3 | Tarefas assíncronas |
| drf-spectacular | 0.27 | Documentação OpenAPI |
| Docker + Compose | — | Containerização |

## Estrutura

```
ecommerce-api/
├── apps/
│   ├── users/      # Autenticação, perfil e endereço de entrega
│   ├── catalog/    # Categorias hierárquicas, produtos e imagens
│   ├── cart/       # Carrinho por usuário
│   └── orders/     # Pedidos, itens com snapshot e notificações
├── config/         # Settings, URLs, Celery
├── manage.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Acesso ao Swagger UI e ReDoc

Por padrao, o Swagger UI (`/api/docs/`) e o ReDoc (`/api/redoc/`) estao disponiveis sem autenticacao.

**Para testar endpoints protegidos no Swagger UI:**

1. Faca login via `POST /api/v1/auth/login/` e copie o `access` token retornado
2. Clique no botao **Authorize** (icone de cadeado) no topo da pagina do Swagger
3. No campo **BearerAuth**, informe: `Bearer eyJ...`
4. Clique em **Authorize** — todos os endpoints passerao a usar esse token

**Por que estar logado no Admin Django nao basta?**

O Admin Django autentica via cookie de sessao. O DRF, por padrao, aceita apenas JWT. Por isso, mesmo estando logado em `/admin/`, o Swagger nao reconhecia a sessao automaticamente.

A correcao implementada foi adicionar `rest_framework.authentication.SessionAuthentication` ao `DEFAULT_AUTHENTICATION_CLASSES` nas configuracoes do DRF. Com isso, o Swagger UI acessado no mesmo navegador onde o admin esta aberto reconhece a sessao sem necessidade de informar o token manualmente.

---

## Como rodar

### Pré-requisitos

- Python 3.11 ou superior
- PostgreSQL 15
- Redis 7
- (Opcional) Docker e Docker Compose

---

### Opção A — Docker

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd ecommerce-api

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env conforme necessário

# 3. Suba os containers
docker compose up --build -d

# 4. Execute as migrations
docker compose exec api python manage.py migrate

# 5. Crie o superusuário
docker compose exec api python manage.py createsuperuser
```

---

### Opção B — Ambiente local (Windows/Linux/macOS)

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd ecommerce-api

# 2. Crie e ative o ambiente virtual
python -m venv venv

# Linux/macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Preencha DB_PASSWORD e demais campos no .env

# 5. Crie o banco no PostgreSQL
# Via psql ou pgAdmin:
# CREATE DATABASE ecommerce_db;

# 6. Execute as migrations
python manage.py migrate

# 7. Crie o superusuário
python manage.py createsuperuser

# 8. Inicie o servidor (terminal 1)
python manage.py runserver

# 9. Inicie o Celery worker (terminal 2, com venv ativado)
# Linux/macOS:
celery -A config worker -l info

# Windows:
celery -A config worker -l info -P solo
```

---

## Variáveis de ambiente

Todas as variáveis obrigatórias estão documentadas no arquivo `.env.example`. O arquivo `.env` nunca deve ser versionado.

| Variável | Descrição |
|---|---|
| `SECRET_KEY` | Chave secreta do Django (obrigatória) |
| `DEBUG` | `True` para desenvolvimento, `False` em produção |
| `ALLOWED_HOSTS` | Hosts permitidos separados por vírgula |
| `DB_NAME` | Nome do banco de dados |
| `DB_USER` | Usuário do PostgreSQL |
| `DB_PASSWORD` | Senha do PostgreSQL |
| `REDIS_URL` | URL de conexão com o Redis |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas para CORS |
| `EMAIL_BACKEND` | Backend de e-mail (console em desenvolvimento) |

---

## Documentação da API

Com o servidor em execução, acesse:

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- Admin Django: `http://localhost:8000/admin/`

---

## Endpoints

### Autenticação — `/api/v1/auth/`

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/register/` | Registrar novo usuário | Não |
| POST | `/login/` | Autenticar e obter tokens JWT | Não |
| POST | `/token/refresh/` | Renovar access token | Não |
| POST | `/logout/` | Invalidar refresh token | Sim |
| GET / PATCH | `/me/` | Dados do usuário autenticado | Sim |
| GET / PATCH | `/profile/` | Perfil e endereço de entrega | Sim |
| POST | `/change-password/` | Alterar senha | Sim |

### Catálogo — `/api/v1/catalog/`

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| GET | `/categories/` | Listar categorias com subcategorias | Não |
| GET | `/categories/{slug}/products/` | Produtos de uma categoria | Não |
| GET | `/products/` | Listar produtos com filtros | Não |
| GET | `/products/{slug}/` | Detalhe do produto | Não |
| GET | `/products/featured/` | Produtos em destaque | Não |
| GET | `/products/low-stock/` | Produtos abaixo do estoque mínimo | Admin |
| POST | `/products/{slug}/upload-images/` | Upload de imagens | Admin |
| PATCH | `/products/{slug}/adjust-stock/` | Ajuste manual de estoque | Admin |
| POST / PUT / PATCH / DELETE | `/products/` | CRUD de produtos | Admin |
| POST / PUT / PATCH / DELETE | `/categories/` | CRUD de categorias | Admin |

**Filtros disponíveis para `/products/`:**

```
?min_price=50&max_price=500
?category=eletronicos
?in_stock=true
?is_featured=true
?status=active
?search=samsung
?ordering=-price
```

### Carrinho — `/api/v1/cart/`

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| GET | `/` | Ver carrinho | Sim |
| POST | `/add/` | Adicionar item ao carrinho | Sim |
| PATCH | `/items/{id}/` | Atualizar quantidade de um item | Sim |
| DELETE | `/items/{id}/` | Remover item do carrinho | Sim |
| DELETE | `/clear/` | Esvaziar o carrinho | Sim |

### Pedidos — `/api/v1/orders/`

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| GET | `/` | Listar pedidos do usuário | Sim |
| POST | `/` | Criar pedido a partir do carrinho | Sim |
| GET | `/{id}/` | Detalhe do pedido | Sim |
| POST | `/{id}/cancel/` | Cancelar pedido | Sim |
| PATCH | `/{id}/update-status/` | Atualizar status do pedido | Admin |
| GET | `/dashboard/` | Estatísticas agregadas | Admin |

---

## Fluxo de uso

**1. Registrar e autenticar**

```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joao",
    "email": "joao@email.com",
    "password": "senha@1234",
    "password2": "senha@1234"
  }'
```

Resposta: dados do usuário + tokens JWT.

**2. Usar o token nas requisições autenticadas**

```
Authorization: Bearer <access_token>
```

**3. Adicionar produto ao carrinho**

```bash
curl -X POST http://localhost:8000/api/v1/cart/add/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'
```

**4. Criar pedido**

```bash
curl -X POST http://localhost:8000/api/v1/orders/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "pix",
    "shipping_street": "Rua das Flores",
    "shipping_number": "100",
    "shipping_neighborhood": "Centro",
    "shipping_city": "Fortaleza",
    "shipping_state": "CE",
    "shipping_zip_code": "60000-000"
  }'
```

A criação do pedido executa em transação atômica: valida estoque, debita cada produto com `select_for_update`, gera snapshot dos preços, limpa o carrinho e enfileira o e-mail de confirmação via Celery.

**5. Renovar o access token quando expirar**

```bash
curl -X POST http://localhost:8000/api/v1/auth/token/refresh/ \
  -d '{"refresh": "<refresh_token>"}'
```

---

## Decisões técnicas relevantes

**Transação atômica com select_for_update**
A criação de pedidos usa `transaction.atomic()` combinado com `select_for_update()` nos produtos. Isso garante que pedidos simultâneos disputando o mesmo estoque não gerem inconsistência — a segunda transação aguarda o desbloqueio da primeira antes de prosseguir.

**Snapshot de preço nos pedidos**
`OrderItem` armazena `product_name`, `product_sku` e `unit_price` no momento da compra. Alterações futuras no produto não afetam o histórico de pedidos.

**Slug com unicidade garantida**
O método `_generate_unique_slug()` em `Category` e `Product` adiciona sufixo numérico incremental caso o slug base já exista, sem depender de exceção de banco para tratar o conflito.

**Signals desacoplados**
`post_save` em `Order` despacha tasks Celery sem que o model conheça a implementação de e-mail. Importação local dentro do signal evita importação circular.

**Rate limiting**
Requisições anônimas são limitadas a 60/hora e autenticadas a 600/hora via `DEFAULT_THROTTLE_RATES` no DRF, reduzindo exposição a ataques de força bruta.

**Headers de segurança em produção**
Com `DEBUG=False`, o projeto ativa automaticamente `HSTS`, `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE` e `CSRF_COOKIE_SECURE`.

---

## Frontend de demonstracao

O diretorio `ecommerce-landing/` contem um frontend React conectado diretamente a esta API.

### Paginas

| Pagina | Descricao |
|---|---|
| Inicio | Produtos em destaque buscados da API |
| Produtos | Listagem com busca, filtro por categoria e ordenacao |
| Detalhe do produto | Imagens, quantidade e adicionar ao carrinho |
| Carrinho | Drawer lateral com atualizacao de itens |
| Login / Cadastro | Autenticacao JWT integrada |
| Checkout | Formulario de endereco e pagamento |
| Pedido | Confirmacao, detalhe e cancelamento |
| Meus pedidos | Historico do usuario autenticado |

### Como rodar

```bash
cd ecommerce-landing
npm install
npm run dev
# Acesse: http://localhost:3000
```

A API deve estar em execucao em `http://localhost:8000`.
