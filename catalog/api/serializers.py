from rest_framework import serializers
from catalog.models import Product, Category,  ProductPropertyValue


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'slug')


class ProductPropertyValueSerializer(serializers.ModelSerializer):
    property = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()

    class Meta:
        model = ProductPropertyValue
        fields = ('property', 'value')

    def get_property(self, obj):
        prop = obj.property_value.property
        return {
            'name': prop.name,
            'slug': prop.slug
        }

    def get_value(self, obj):
        property_value = obj.property_value
        return {
            'name': property_value.name,
            'slug': property_value.slug
        }


class ProductListSerializer(serializers.ModelSerializer):
    ppvs = ProductPropertyValueSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            'name', 'slug', 'ppvs'
        )


class ProductDetailSerializer(ProductListSerializer):
    class Meta(ProductListSerializer.Meta):
        pass
