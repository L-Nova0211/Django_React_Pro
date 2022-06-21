from django.urls import path
from . import api_views as product_api

urlpatterns = [
    path('getAllProducts', product_api.getAllProducts, name="getAllProducts"),
    path('updateProductDetail', product_api.updateProductDetail, name="updateProductDetail"),
    path('updateProductInfo', product_api.updateProductInfo, name="updateProductInfo"),
]