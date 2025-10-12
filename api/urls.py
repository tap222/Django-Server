from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

app_name = 'api'

router = DefaultRouter()
# router.register(r'events', views.EventsListCreate)

urlpatterns = [
    path('events/', views.events_for_user, name='events'),
    path('events/details/', views.event_details, name='event_details'),
    path('events/streamer/', views.get_server_streamer, name='event_streamer'),
    # path('events/', views.EventsListCreate.as_view(), name='bot_get_events'),
    # path('', include(router.urls)),
]
# urlpatterns = router.urls