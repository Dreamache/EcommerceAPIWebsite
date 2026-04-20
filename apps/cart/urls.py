from django.urls import path

from . import views

urlpatterns = [
    path('', views.CartView.as_view(), name='cart-detail'),
    path('add/', views.AddToCartView.as_view(), name='cart-add'),
    path('items/<int:item_id>/', views.CartItemView.as_view(), name='cart-item'),
    path('clear/', views.ClearCartView.as_view(), name='cart-clear'),
]
