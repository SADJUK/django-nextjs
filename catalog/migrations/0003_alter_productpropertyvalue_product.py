# Generated by Django 4.1.4 on 2023-01-10 22:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0002_property_alter_product_category_alter_product_slug_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productpropertyvalue',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ppvs', to='catalog.product'),
        ),
    ]
