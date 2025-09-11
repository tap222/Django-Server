from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from events.models import Events


# Create your views here.
# @login_required(login_url='users:login')
def events(request):
    events = Events.objects.all()

    return render(request, 'events/browseEvents.html', { 'events': events})