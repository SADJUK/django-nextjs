import random
from collections import defaultdict

from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from catalog.models import (
    Product, Category, Property, PropertyValue, ProductPropertyValue
)
from catalog.redis import categories_storage

config = {
    'categories': [
        'winter', 'summer', 'allseason'
    ],
    'properties': {
        'brand': {
            'name': 'Бренд',
            'slug': 'brand',
            'items': [
                'Barum',
                'Michelin',
                'Goodyear',
                'Bridgestone',
                'Accelera',
                'Agate',
                'Momo'
            ],
        },
        'diameter': {
            'name': 'Діаметр',
            'slug': 'diameter',
            'items': [
                'R16', 'R17', 'R18', 'R20'
            ]
        },
        'width': {
            'name': 'Ширина',
            'slug': 'width',
            'items': [
                '155', '160', '170', '175', '180',
            ]
        },
        'height': {
            'name': 'Висота',
            'slug': 'height',
            'items': [
                '55', '60', '65', '70'
            ]
        }
    }
}


class Command(BaseCommand):

    def handle(self, *args, **options):
        Category.objects.all().delete()
        Product.objects.all().delete()
        Property.objects.all().delete()
        categories = []

        for c_name in config['categories']:
            categories.append(Category(name=c_name, slug=slugify(c_name)))
        categories = Category.objects.bulk_create(categories)
        properties_config = config['properties']
        products = []
        properties = []
        property_values = []
        for category in categories:
            for prop_data in properties_config.values():
                prop = Property(
                    category=category,
                    name=prop_data['name'],
                    slug=prop_data['slug']
                )
                properties.append(prop)
                for value in prop_data['items']:
                    property_values.append(PropertyValue(
                        property=prop,
                        name=value,
                        slug=slugify(value)
                    ))
        Property.objects.bulk_create(properties)
        PropertyValue.objects.bulk_create(property_values)

        property_values_map = {}
        for category in categories:
            property_values_map[category] = {
                pv.name: pv
                for pv in PropertyValue.objects.filter(
                   property__category=category)
            }

        ppvs = []

        def create_ppv(_product, _property_value):
            ppvs.append(ProductPropertyValue(
                product=_product,
                property_value=_property_value
            ))

        def get_property_value(property_slug, category):
            _property_value = property_values_map[category][
                random.choice(properties_config[property_slug]['items'])]
            return _property_value

        used = set()
        for i in range(500000):
            category = random.choice(categories)
            brand = get_property_value('brand', category)
            width = get_property_value('width', category)
            height = get_property_value('height', category)
            diameter = get_property_value('diameter', category)
            name = f'{brand.name} {category.name.title()} ' \
                   f'{width.name}/{height.name} {diameter.name}'
            slug = slugify(name)
            if slug in used:
                continue
            used.add(slug)
            product = Product(
                name=name,
                slug=slug,
                category=category
            )
            products.append(product)
            for item in [brand, width, height, diameter]:
                create_ppv(product, item)
        Product.objects.bulk_create(products, batch_size=1000)
        ProductPropertyValue.objects.bulk_create(ppvs, batch_size=1000)
        categories_storage.fill()
