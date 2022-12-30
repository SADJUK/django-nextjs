import random

from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from catalog.models import Product, Category


config = {
    'categories': [
        'winter', 'summer', 'allseason'
    ],
    'brands': [
        'Barum',
        'Michelin',
        'Goodyear',
        'Bridgestone',
        'Accelera',
        'Agate',
        'Momo'
    ],
    'diameters': [
        'R16', 'R17', 'R18', 'R20'
    ],
    'widths': [
        '155', '160', '170', '175', '180',
    ],
    'heights': [
        '55', '60', '65', '70'
    ]
}


class Command(BaseCommand):

    def handle(self, *args, **options):
        Category.objects.all().delete()
        Product.objects.all().delete()
        categories = []
        for c_name in config['categories']:
            categories.append(Category(name=c_name, slug=slugify(c_name)))
        categories = Category.objects.bulk_create(categories)
        products = []
        for i in range(500000):
            brand = random.choice(config['brands'])
            category = random.choice(categories)
            width = random.choice(config['widths'])
            height = random.choice(config['heights'])
            diameter = random.choice(config['diameters'])
            name = f'{brand} {category.name.title()} {width}/{height} {diameter}'
            products.append(Product(
                name=name,
                slug=slugify(name),
                category=category
            ))
        Product.objects.bulk_create(products, batch_size=1000)
