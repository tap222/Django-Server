from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from events.models import Events
from bots.models import Bots
from api.serializers import EventsSerializer
from api.utils import same_origin_required
from rest_framework.decorators import permission_classes
from api.permissions import BotKeyPermission

# Create your views here.

# class EventsListCreate(viewsets.ModelViewSet):
#     queryset = Events.objects.all()
#     serializer_class = EventsSerializer

@api_view(["GET"])
@permission_classes([BotKeyPermission])
@same_origin_required
def events_for_user(request):
    username = request.data.get("username")

    if username:
        events = Events.objects.filter(user__username=username, event_status='ACCEPTED')
    
        data = [
            {
                'event_id': event.event_id,
                'event_title': event.event_title,
                'event_date': event.event_date,
                'event_time': event.event_time
            }
            for event in events
        ]

        return Response(data, status=200)
    else:
        return Response(None, status=204)

@api_view(["GET"])
@permission_classes([BotKeyPermission])
@same_origin_required
def event_details(request):
    event_id = request.data.get('event_id')

    if event_id:
        event = Events.objects.filter(event_id=event_id).first()
        bot = Bots.objects.filter(server=event.server).first()

        data = {
            'server_id': event.server.server_id,
            'username': event.lesson.teacher.user.username,
            'event_title': event.event_title,
            'event_description': event.event_description,
            'self_token': bot.bot_self_token,
        }

        return Response(data, status=200)

    else:
        return Response(None, status=204)


@api_view(["GET"])
@permission_classes([BotKeyPermission])
@same_origin_required
def get_server_streamer(request):
    server_id = request.data.get('server_id')
    
    if server_id:
        bot = Bots.objects.filter(server__server_id=server_id).first()
        if not bot:
            return Response("This server does not have a self_bot", status=204)

        data = {
            'server_id': server_id,
            'bot_id': bot.bot_id,
            'bot_self_token': bot.bot_self_token
        }

        return Response(data, status=200)
    else:
        return Response(None, status=204)