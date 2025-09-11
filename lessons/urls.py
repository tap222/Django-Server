from django.urls import path, include
from lessons import views
from django.contrib.auth.decorators import login_required


app_name = 'lessons'

urlpatterns = [
    path('', views.lessons, name='lessons'),

]