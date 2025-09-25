from django.urls import path, include
from events import views
from django.contrib.auth.decorators import login_required


app_name = 'events'

urlpatterns = [
    path('', views.events, name='events'),
    path('event/<uuid:event_id>', views.event_view, name='event_view'),
    path('event/ticket/<uuid:event_id>', views.event_buy_ticket, name='event_buy_ticket')

    
]