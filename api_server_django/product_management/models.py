from django.db import models

# Create your models here.
from django.utils.translation import ugettext_lazy as _
from category_management.models import Category
from member.models import Member

# Create your models here.

class Product(models.Model):
    asin = models.CharField(_('asin'), max_length=255)
    title = models.CharField(_('title'), max_length=255)
    url = models.TextField(_('url'))
    own_description = models.TextField(_('description'))
    is_prime = models.BooleanField(_('is_prime'))
    update_time = models.DateTimeField(_('update_time'), auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = "products"
        ordering = ['id']


class ProductDescription(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    content = models.TextField(_('content'))
    # product = models.ForeignKey(Product, on_delete=models.CASCADE)
    def __str__(self):
        return self.description
    
    class Meta:
        db_table = "descriptions"

class ProductImage(models.Model):
    url = models.TextField(_('url'))
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    def __str__(self):
        return self.url

    class Meta:
        db_table = "images"
        
class ProductInfo(models.Model):
    price = models.FloatField(_('price'), default=0)
    seller = models.CharField(_('seller'), max_length=255)
    shipper = models.CharField(_('shipper'), max_length=255)
    stocks = models.IntegerField(_('stocks'), default=0)
    stocks_status = models.IntegerField(_('stocks_status'), default=0)
    # 0 - correct value
    # 1 - cannot get stocks
    # 2 - limit of purchase
    # 3 - over 999
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    def __str__(self):
        return self.seller

    class Meta:
        db_table = "productinfo"

class ProductProposer(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        db_table = "productproposer"