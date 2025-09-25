from django.db import models
from django.contrib.auth.models import User
from events.models import Events
import uuid

# Create your models here.


class Tickets(models.Model):
    STATUS=[
        ('normal', 'Normal'),
        ('refuned', 'Refunded')
    ]


    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    event= models.ForeignKey(Events, on_delete=models.CASCADE, null=True, blank=True)
    ticket_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_status = models.CharField(choices=STATUS, default='normal')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)



class Archived_Tickets(models.Model):
    STATUS=[
        ('normal', 'Normal'),
        ('refuned', 'Refunded')
    ]


    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    event= models.ForeignKey(Events, on_delete=models.CASCADE, null=True, blank=True)
    ticket_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_status = models.CharField(choices=STATUS, default='normal')
    updated_at = models.DateTimeField()
    created_at = models.DateTimeField()
    delete_at = models.DateTimeField(auto_now_add=True)