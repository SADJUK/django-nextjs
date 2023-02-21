from collections import defaultdict
from time import sleep

from django.db.models import Prefetch, Count, Q, OuterRef
from django.http import Http404
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .serializers import (
    CategorySerializer, ProductDetailSerializer, ProductListSerializer)
from catalog.models import (
    Product, Category, Property, PropertyValue,
)
from .utils import get_filters_from_request, InvalidFiltersError


class SleepMixin:
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class ProductsPagination(PageNumberPagination):
    page_size = 20

    def get_paginated_response(self, data):
        page = self.page
        paginator = page.paginator
        pages = list(range(
            max(1, page.number - 3),
            min(paginator.num_pages, page.number + 3) + 1
        ))
        return Response({
            'results': data,
            'pagination': {
                'total': paginator.count,
                'current': page.number,
                'has_next': self.page.has_next(),
                'has_prev': self.page.has_previous(),
                'first_page': 1 if 1 not in pages else None,
                'pages': pages,
                'last_page': (
                    paginator.num_pages
                    if paginator.num_pages not in pages else None
                )
            },
        })


class CategoryProductsAPIView(SleepMixin, ListAPIView):
    queryset = Product.objects.select_related(
        'category'
    ).prefetch_related(
        'ppvs__property_value', 'ppvs__property_value__property'
    ).order_by('name')
    serializer_class = ProductListSerializer
    pagination_class = ProductsPagination

    def apply_filters(self, products, category):
        filters = get_filters_from_request(self.request, category)

        for value in filters.values():
            products = products.filter(
                ppvs__property_value__id__in=value)
        return products

    def get_queryset(self):
        try:
            category = Category.objects.get(slug=self.kwargs['slug'])
        except Category.DoesNotExist:
            raise Http404
        return self.apply_filters(
            self.queryset.filter(category=category), category)

    def handle_exception(self, exc):
        if isinstance(exc, InvalidFiltersError):
            response = Response({}, status=status.HTTP_400_BAD_REQUEST)
            response.exception = True
            return response
        return super().handle_exception(exc)


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
    queryset = Product.objects.select_related(
        'category'
    ).prefetch_related(
        'ppvs__property_value', 'ppvs__property_value__property'
    )


class FiltersAPIVIew(SleepMixin, APIView):
    def get(self, request, *args, **kwargs):
        try:
            category = Category.objects.get(
                slug=self.kwargs['slug'])
        except Category.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            request_filters = get_filters_from_request(request, category)
        except InvalidFiltersError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        pvs_query = Q()
        for prop_slug in Property.objects.filter(
            category=category
        ).values_list('slug', flat=True):
            prop_q = Q(property__slug=prop_slug)

            products = Product.objects.filter(
                category__slug=category,
            )
            modified = False
            for key, value in request_filters.items():
                if key == prop_slug:
                    continue
                products = products.filter(
                    ppvs__property_value_id__in=value)
                modified = True
            if modified:
                prop_q &= Q(ppvs__product__in=products)
            pvs_query |= prop_q

        filters = []
        for prop in Property.objects.filter(
            category=category
        ).order_by('name').prefetch_related(
            Prefetch(
                'values',
                queryset=PropertyValue.objects.annotate(
                    cnt=Count('ppvs', filter=pvs_query)
                ).order_by('name'),
                to_attr='pvs_with_products'
            )
        ):
            filters.append({
                'name': prop.name,
                'slug': prop.slug,
                'checked': prop.slug in request_filters,
                'options': [
                    {
                        'name': pv.name,
                        'slug': pv.slug,
                        'count': pv.cnt,
                        'checked': pv.id in request_filters.get(
                            prop.slug, [])
                    } for pv in prop.pvs_with_products
                ]
            })
        return Response(filters)
