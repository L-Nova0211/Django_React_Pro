from django.db import models
from django.utils.translation import ugettext_lazy as _
from member.models import Member

# Create your models here.

class Category(models.Model):
    name = models.CharField(_('name'), max_length=255, unique=True)
    url = models.TextField(_('url'))
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    is_scraped = models.IntegerField(_('is_scraped'), default=0)
    registered_at = models.DateTimeField(_('registered_at'), auto_now_add=True)
    class Meta:
        ordering = ['registered_at']
        db_table = "categories"