from django.urls import path, include
from . import views

app_name = 'application'

urlpatterns = [
    path('server/', views.server, name='server'),
    path('teacher/', views.teacher, name='teacher'),
    
]