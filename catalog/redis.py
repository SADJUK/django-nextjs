import redis
from django.conf import settings

from catalog.models import Category

connection = redis.Redis(**settings.REDIS_CONNECTION_PARAMS)


class CategoriesStorage:
    client = connection
    key = 'categories-slugs'

    def exists(self, item):
        return self.client.sismember(self.key, item)

    def fill(self):
        slugs = list(Category.objects.values_list('slug', flat=True))
        self.client.sadd(self.key, *slugs)


categories_storage = CategoriesStorage()
