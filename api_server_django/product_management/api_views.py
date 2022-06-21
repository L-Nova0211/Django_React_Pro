from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from .models import Product, ProductDescription, ProductImage, ProductProposer, ProductInfo
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from member.models import Member
from rest_framework.response import Response
from django.core import serializers
from django.http import JsonResponse
import json

# Create your views here.
@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def getAllProducts(request):
    code = 401
    email = request.user
    user = Member.objects.get(email=email)
    products = Product.objects.all()
    products_list = []
    errors = {}
    for product in products:
        if user.is_superuser or ProductProposer.objects.filter(member=user.id,product=product.id).exists():
            proposeinfo = {
                "category": "-1"
            }
            if ProductProposer.objects.filter(member=user.id,product=product.id).exists():
                proposeinfo = ProductProposer.objects.get(member=user.id,product=product.id)
            descriptions = ProductDescription.objects.filter(product=product.id)
            contents = ""
            for description in descriptions:
                contents += description.content.replace('\n',' ')
                contents += "~"
            images = ProductImage.objects.filter(product=product.id)
            urls = ""
            for image in images:
                urls += str(image.url)
                urls += ","
            infos = ProductInfo.objects.filter(product=product.id)
            info_list = []
            avg_price = 0
            cnt_price = 0
            total_stocks = 0
            for info in infos:
                if info.price:
                    cnt_price = cnt_price + 1
                    avg_price = avg_price + info.price    
                if info.stocks:
                    total_stocks = total_stocks + info.stocks
                info_list.append({
                    "id": info.id,
                    "price": info.price,
                    "seller": info.seller,
                    "shipper": info.shipper,
                    "stocks": info.stocks,
                    "stocks_status": info.stocks_status,
                })
            if not cnt_price == 0:
                avg_price = avg_price / cnt_price
            print(proposeinfo)
            products_list.append({
                "id": product.id,
                "asin": product.asin,
                "title": product.title,
                "url": product.url,
                "own_description": product.own_description,
                "is_prime": product.is_prime,
                "contents": contents,
                "imgurls": urls,
                "info_list": info_list,
                "avg_price": avg_price,
                "total_stocks": total_stocks,
                "category_id": proposeinfo['category']
            })
    if len(products_list) >= 0:
        code = 200
    products_list1 = json.dumps(products_list, separators=(',', ':'))
    if code == 200:
        return JsonResponse({
            'code': code,
            'content': products_list1,
        })
    else:
        return JsonResponse({
            'code': code,
        })

@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def updateProductDetail(request):
    code = 401
    id = request.data.get('id')
    asin = request.data.get('asin')
    title = request.data.get('title')
    own_description = request.data.get('own_description')
    old_product = {}
    errors = {}
    if id and asin and own_description:
        if Product.objects.filter(id=id).exists():
            old_product = Product.objects.get(id=id)
            old_product.asin = asin
            old_product.title = title
            old_product.own_description = own_description
            old_product.save()
            code = 200
        else:
            errors["product"] = "Not existing product"
            code = 404
    else:
        errors["product"] = "Require fields"
        code = 300
    if code == 200:
        return Response({
            'code': code,
            'content': {
                "id": old_product.id,
                "asin": old_product.asin,
                "title": old_product.title,
                "own_description": old_product.own_description,
                "is_prime": old_product.is_prime,
                "update_time": old_product.update_time,
            },
        })
    else:
        return Response({
            'code': code,
        })


@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def updateProductInfo(request):
    code = 401
    info_id = request.data.get('id')
    seller = request.data.get('seller')
    stocks = request.data.get('stocks')
    stocks_status = request.data.get('stocks_status')
    shipper = request.data.get('shipper')
    price = request.data.get('price')
    old_product_info = {}
    errors = {}
    if ProductInfo.objects.filter(id=info_id).exists():
        old_product_info = ProductInfo.objects.get(id=info_id)
        old_product_info.seller = seller
        old_product_info.stocks = stocks
        old_product_info.shipper = shipper
        old_product_info.price = price
        old_product_info.save()
        code = 200
    else:
        errors["productinfo"] = "noexisting product info"
        code = 300
    if code == 200:
        return Response({
            'code': code,
            'content': {
                "info_id": old_product_info.id,
                "seller": old_product_info.seller,
                "stocks": old_product_info.stocks,
                "shipper": old_product_info.shipper,
                'price': old_product_info.price,
            },
        })
    else:
        return Response({
            'code': code,
            'errors': errors
        })

