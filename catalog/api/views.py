from django.http import Http404
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .serializers import (
    CategorySerializer, ProductDetailSerializer, ProductListSerializer)
from catalog.models import Product, Category

from time import sleep

class ProductsPagination(PageNumberPagination):
    page_size = 20


class CategoryProductsAPIView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer
    pagination_class = ProductsPagination

    def get_queryset(self):
        try:
            category = Category.objects.get(slug=self.kwargs['slug'])
        except Category.DoesNotExist:
            raise Http404
        sleep(0)
        return self.queryset.filter(category=category)


class ProductRetrieveAPIView(RetrieveAPIView):
    lookup_url_kwarg = 'slug'
    serializer_class = ProductDetailSerializer
    queryset = Product.objects.all()

    def get(self, *args, **kwargs):
        sleep(0)
        return super().get(*args, **kwargs)


class CategoryListAPIVIew(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get(self, *args, **kwargs):
        sleep(0)
        return super().get(*args, **kwargs)


class CategoryRetrieveAPIView(RetrieveAPIView):
    lookup_url_kwarg = 'slug'
    lookup_field = 'slug'
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def get(self, *args, **kwargs):
        sleep(0)
        return super().get(*args, **kwargs)
