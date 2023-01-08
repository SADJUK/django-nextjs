from django.http import Http404
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .serializers import (
    CategorySerializer, ProductDetailSerializer, ProductListSerializer)
from catalog.models import Product, Category

from time import sleep


class SleepMixin:
    def dispatch(self, request, *args, **kwargs):
        sleep(5)
        return super().dispatch(request, *args, **kwargs)


class ProductsPagination(PageNumberPagination):
    page_size = 20


class CategoryProductsAPIView(SleepMixin, ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer
    pagination_class = ProductsPagination

    def get_queryset(self):
        try:
            category = Category.objects.get(slug=self.kwargs['slug'])
        except Category.DoesNotExist:
            raise Http404
        return self.queryset.filter(category=category)


class CategoryListAPIVIew(SleepMixin, ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryRetrieveAPIView(SleepMixin, RetrieveAPIView):
    lookup_url_kwarg = 'slug'
    lookup_field = 'slug'
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class ProductRetrieveAPIView(SleepMixin, RetrieveAPIView):
    lookup_url_kwarg = 'slug'
    lookup_field = 'slug'
    serializer_class = ProductDetailSerializer
    queryset = Product.objects.all()
