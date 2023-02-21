from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField()

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.name


class Property(models.Model):
    category = models.ForeignKey(
        Category, related_name='properties',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField()

    class Meta:
        unique_together = ('category', 'name')


class PropertyValue(models.Model):
    property = models.ForeignKey(
        Property, related_name='values', on_delete=models.CASCADE
    )
    slug = models.SlugField()
    name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('property', 'name')


class ProductPropertyValue(models.Model):
    product = models.ForeignKey(
        Product, related_name='ppvs', on_delete=models.CASCADE)
    property_value = models.ForeignKey(
        PropertyValue, related_name='ppvs', on_delete=models.CASCADE
    )
