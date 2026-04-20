"""
Views do carrinho de compras.

Observacoes:
- Todas as views exigem autenticacao; carrinho e privado por natureza
- get_or_create garante que o carrinho existe sem necessidade de criacao explicita
- UpdateCartItemSerializer recebe o item via contexto para validar contra o estoque
  sem fazer uma query extra dentro do validate
- select_related('product') em get_item evita N+1 ao acessar item.product
"""

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import (
    AddToCartSerializer,
    CartSerializer,
    UpdateCartItemSerializer,
)


class CartView(APIView):
    """GET /api/v1/cart/"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class AddToCartView(APIView):
    """
    POST /api/v1/cart/add/

    Adiciona produto ao carrinho.
    Se o produto ja existir, soma a quantidade informada ao total atual.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity},
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return Response(
                    {
                        'detail': (
                            f'Quantidade total ({new_quantity}) excede o estoque '
                            f'disponivel ({product.stock}). '
                            f'Ja no carrinho: {cart_item.quantity}.'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cart_item.quantity = new_quantity
            cart_item.save(update_fields=['quantity'])

        return Response(
            CartSerializer(cart, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )


class CartItemView(APIView):
    """
    PATCH /api/v1/cart/items/{item_id}/  — atualizar quantidade
    DELETE /api/v1/cart/items/{item_id}/ — remover item
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_item(self, item_id, user):
        return get_object_or_404(
            CartItem.objects.select_related('product'),
            id=item_id,
            cart__user=user,
        )

    def patch(self, request, item_id):
        item = self.get_item(item_id, request.user)
        serializer = UpdateCartItemSerializer(
            data=request.data,
            context={'item': item},
        )
        serializer.is_valid(raise_exception=True)

        item.quantity = serializer.validated_data['quantity']
        item.save(update_fields=['quantity'])

        return Response(
            CartSerializer(item.cart, context={'request': request}).data
        )

    def delete(self, request, item_id):
        item = self.get_item(item_id, request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClearCartView(APIView):
    """DELETE /api/v1/cart/clear/"""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.clear()
        return Response({'detail': 'Carrinho esvaziado com sucesso.'})
