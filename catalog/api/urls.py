from django.urls import path
from catalog.api.views import (
    ProductRetrieveAPIView, CategoryProductsAPIView, CategoryListAPIVIew,
    CategoryRetrieveAPIView
)

urlpatterns = [
    path(
        'product/<slug:slug>',
        ProductRetrieveAPIView.as_view(),
    ),
    path(
        'categories',
        CategoryListAPIVIew.as_view()
    ),
    path(
        'categories/<slug:slug>',
        CategoryRetrieveAPIView.as_view()
    ),
    path(
        'categories/<slug:slug>/products',
        CategoryProductsAPIView.as_view(),
    ),
]
