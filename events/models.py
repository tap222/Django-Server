from django.db import models
from servers.models import Servers
from django.contrib.auth.models import User
from lessons.models import Lessons
import uuid


# Create your models here.

class Events(models.Model):
    STATUS = {
        'PENDING': 'Pending',
        'ACCEPTED': 'Accepted',
        'REJECTED': 'Rejected',
        'RESCHEDULED': 'Rescheduled',
        'CANCELED': 'Canceled',
    }

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    server = models.ForeignKey(Servers, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lessons, on_delete=models.CASCADE)
    event_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_title = models.CharField(max_length=200)
    event_description = models.TextField()
    event_date = models.DateField(null=True)
    event_time = models.TimeField(null=True)
    event_status = models.CharField(choices=STATUS, default='PENDING')
    event_banner = models.ImageField(upload_to='event_banner', default='event_banner/default_event_banner.jpg')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return self.event_title


class Archived_Events(models.Model):
    STATUS = {
        'PENDING': 'Pending',
        'ACCEPTED': 'Accepted',
        'REJECTED': 'Rejected',
        'RESCHEDULED': 'Rescheduled',
        'CANCELED': 'Canceled',
    }

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    server = models.ForeignKey(Servers, on_delete=models.SET_NULL, null=True, blank=True)
    lesson = models.ForeignKey(Lessons, on_delete=models.SET_NULL, null=True, blank=True)
    event_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_title = models.CharField(max_length=200)
    event_description = models.TextField()
    event_date = models.DateField(null=True)
    event_time = models.TimeField(null=True)
    updated_at = models.DateTimeField()
    created_at = models.DateTimeField()
    deleted_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.event_title
