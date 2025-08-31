from django.urls import path, include
from . import views

app_name = 'servers'

urlpatterns = [
    # path('register/', views.register, name='register'),
    path('apply/', views.server_apply, name='application'),

]