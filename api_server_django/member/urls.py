from django.urls import path
from . import api_views as member_api

urlpatterns = [
    path('register', member_api.register, name="Register"),
    path('login', member_api.login, name="Login"),
    path('selfInfo', member_api.selfInfo, name="SelfInfo"),
    path('update', member_api.update, name="SelfUpdate"),
    path('getAllUsers', member_api.getAllUsers, name="getAllUsers"),
    path('updateRole/<id>', member_api.updateRole, name="updateRole"),
]