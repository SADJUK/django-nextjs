from rest_framework.serializers import ModelSerializer
from catalog.models import Product, Category


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductListSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductDetailSerializer(ProductListSerializer):
    class Meta(ProductListSerializer.Meta):
        pass
