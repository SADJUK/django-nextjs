from collections import defaultdict

from django.db.models import Q

from catalog.models import PropertyValue
from catalog.settings import PAGINATION_PARAM_NAME


class InvalidFiltersError(Exception):

    def __init__(self, invalid_filters):
        self.invalid_filters = invalid_filters

    def __repr__(self):
        return str(self.invalid_filters)

    def __str__(self):
        return self.__repr__()


def get_filters_from_request(request, category):
    request_params = {}
    for key, value in request.GET.dict().items():
        request_params[key] = value.split(',')
    filters = defaultdict(set)
    request_params.pop(PAGINATION_PARAM_NAME, None)
    if request_params:
        query = Q()
        for key, value in request_params.items():
            query |= Q(property__slug=key, slug__in=value)
        for prop_slug, pv_id in PropertyValue.objects.filter(
            property__category=category
        ).filter(query).values_list('property__slug', 'id'):
            filters[prop_slug].add(pv_id)
        invalid_filters = {}
        for key, value in request_params.items():
            db_filters = filters.get(key, set())
            if len(value) != len(db_filters):
                invalid_filters[key] = [
                    item for item in value if item not in db_filters]
                raise InvalidFiltersError(invalid_filters)
    return filters
