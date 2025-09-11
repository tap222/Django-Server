from django.urls import path, include
from events import views
from django.contrib.auth.decorators import login_required


app_name = 'events'

urlpatterns = [
    path('', views.events, name='events'),

    
]