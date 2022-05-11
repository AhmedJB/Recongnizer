from django.contrib import admin
from django.urls import path,include
from api.views import *

urlpatterns = [
    path("test",Test.as_view()),
    path("recon",Recognize.as_view()),
]