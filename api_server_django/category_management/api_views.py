from django.shortcuts import render
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from .models import Category
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from member.models import Member
from rest_framework.response import Response
from django.core import serializers
import json
from datetime import datetime, date
from django.http import JsonResponse
from .scraping import run

# Create your views here.
# @api_view(['POST'])
# @authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
# @permission_classes([])
# def register(request):
#     name = request.data.get('name')
#     url = request.data.get('url')
#     admin = Member.objects.get(email=request.user)
#     code = 401
#     category = {}
#     if admin.is_superuser:
#         if Category.objects.filter(name=name).exists():
#             code = 300
#         else:
#             category = Category.objects.create(name=name, url=url, member=admin)
#             code = 200
#     else:
#         code = 401

#     if code == 200:
#         return Response({
#             'code': code,
#             'content': {
#                 'id': category.id,
#                 'name': category.name,
#                 'url': category.url,
#                 'isScraped': category.isScarped,
#                 'registered_at': category.registered_at,
#             },
#         })
#     else:
#         return Response({
#             'code': code,
#             'content': {},
#         })

@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def proposeCategory(request):
    code = 401
    name = request.data.get('name')
    url = request.data.get('url')
    member = Member.objects.get(email=request.user)
    is_scraped = 0
    errors = {}
    if member.bid <= 0:
        code = 304
        errors["Access"] = "You ran out of bid"
    elif name and url:
        # if Category.objects.filter(url=url).exists():
        #     code = 404
        #     errors["url"] = "Existing category"
        # else:
        category = Category.objects.create(name=name, url=url, member=member, is_scraped=is_scraped)
        member.bid = member.bid - 1
        member.save()
        # startScrap(category.url)
        code = 200
    else:
        code = 300

    if code == 200:
        return Response({
            'code': code,
            'content': {
                'id': category.id,
                'name': category.name,
                'url': category.url,
                'member': category.member.email,
                'is_scraped': category.is_scraped,
                'registered_at': category.registered_at,
            },
        })
    else:
        return Response({
            'code': code,
            'content': {},
            'errors': errors
        })


@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def updateCategory(request):
    code = 401
    id = request.data.get('id')
    name = request.data.get('name')
    url = request.data.get('url')
    member = Member.objects.get(email=request.user)
    is_scraped = 0
    errors = {}
    if name and url:
        if Category.objects.filter(id=id).exists():
            category = Category.objects.get(id = id)
            category.name = name
            category.url = url
            category.save()
            # startScrap(category.url)
            code = 200
        else:
            code = 404
            errors["url"] = "Not Existing category"
    else:
        code = 300

    if code == 200:
        return Response({
            'code': code,
            'content': {
                'id': category.id,
                'name': category.name,
                'url': category.url,
                'member': category.member.email,
                'is_scraped': category.is_scraped,
                'registered_at': category.registered_at,
            },
        })
    else:
        return Response({
            'code': code,
            'content': {},
            'errors': errors
        })


@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def getAllCategories(request):
    code = 401
    categories = Category.objects.select_related('member').all()
    code = 200
    
    category_list = []
    for category in categories:
        category_list.append({
            "id": category.id,
            "name": category.name,
            "url": category.url,
            "member": category.member.email,
            "is_scraped": category.is_scraped,
            "registered_at": category.registered_at.strftime("%d-%b-%Y %H:%M:%S.%f") ,
        })
    
    category_list1 = json.dumps(category_list, separators=(',', ':'))

    if code == 200:
        return JsonResponse({
            'code': code,
            'content': category_list,
        })
    else:
        return JsonResponse({
            'code': code,
        })


@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def deleteCategory(request):
    code = 401
    id = request.data.get('id')
    if id:
        try:
            category = Category.objects.get(id = id)

            category.delete()
            code = 200
        except Exception:
            code = 500
    else:
        code = 300

    return Response({
        'code': code,
    })


@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def toggleCategory(request):
    code = 401
    id = request.data.get('id')
    if id:
        try:
            category = Category.objects.get(id = id)
            
            # 0 - not start
            # 1 - completed
            # 2 - running
            # 3 - fail
            # if category.is_scraped == 0:
            #     startScrap(category.url)
            #     category.is_scraped = 2
            # elif category.is_scraped == 2:
            #     category.is_scraped = 1
            # elif category.is_scraped == 1:
            #     category.is_scraped = 0
            # if category.is_scraped == 0:
            #     startScrap(category.url)
            #     category.is_scraped = 2

            category.save()
            code = 200
        except Exception:
            code = 500
    else:
        code = 300

    if code == 200:
        return Response({
            'code': code,
            'is_scraped': category.is_scraped
        })
    else:
        return Response({
            'code': code,
        })


@api_view(['POST'])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
@permission_classes([])
def proposeScrape(request):
    code = 401
    member = Member.objects.get(email=request.user)

    today = date.today()
    member.lastPropose = today
    
    member.save()
    startScrap(member.id)
    code = 200

    if code == 200:
        return Response({
            'code': code,
        })
    else:
        return Response({
            'code': code,
        })


def startScrap(id):
    run.start(id)