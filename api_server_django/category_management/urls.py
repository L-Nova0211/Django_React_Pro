from django.urls import path
from . import api_views as category_api

urlpatterns = [
    path('proposeCategory', category_api.proposeCategory, name="proposeCategory"),
    path('updateCategory', category_api.updateCategory, name="updateCategory"),
    path('proposeScrape', category_api.proposeScrape, name="proposeScrape"),
    path('getAllCategories', category_api.getAllCategories, name="AllCategories"),
    path('deleteCategory', category_api.deleteCategory, name="deleteCategory"),
    path('toggleCategory', category_api.toggleCategory, name="toggleCategory"),
]