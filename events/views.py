from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from events.models import Events
from tickets.models import Tickets


# Create your views here.
# @login_required(login_url='users:login')
def events(request):
    events = Events.objects.all()

    return render(request, 'events/browseEvents.html', { 'events': events})


@login_required(login_url='users:login')
def event_view(request, event_id):
    event = Events.objects.filter(event_id=event_id).first()

    return render(request, 'events/eventDetails.html', { 'event': event})

@login_required(login_url='users:login')
def event_buy_ticket(request, event_id):
    event = Events.objects.filter(event_id=event_id).first()
    ticket_check = Tickets.objects.filter(event=event, user=request.user).exists()

    if ticket_check:
        response = {
            'message': 'You already bought a ticket for this event.',
            'status': 'Warning',
            'type':'warning'
        }
    else:
        Tickets.objects.create(
            user=request.user,
            event=event,
        )
        response = {
            'message': 'You have succefully bought a ticket for this event.',
            'status': 'Success',
            'type': 'success'
        }
    

    return render(request, 'events/ticketBought.html', { 'response': response})