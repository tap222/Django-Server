from django.db import models
from django.contrib.auth.models import User
from safedelete.models import SafeDeleteModel
from safedelete.models import SOFT_DELETE

# Create your models here.

class Servers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    server_id = models.BigIntegerField(primary_key=True)
    server_name = models.CharField(max_length=50)
    server_description = models.TextField()
    server_interests = models.CharField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Server"
        verbose_name_plural = "Servers"

    def __str__(self):
        return self.server_name


class Server_Applications(models.Model):

    STATUS = {
        "pending": "Pending",
        "accepted": "Accepted",
        "rejected": "Rejected",
    }


    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    server_id = models.BigIntegerField(primary_key=True)
    server_name = models.CharField(max_length=50)
    server_description = models.TextField()
    server_interests = models.TextField()
    status = models.CharField(choices=STATUS, default='pending')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Server Application"
        verbose_name_plural = "Server Applications"

    def __str__(self):
        return self.server_name


class Archived_Server_Applications(models.Model):

    STATUS = {
        "pending": "Pending",
        "accepted": "Accepted",
        "rejected": "Rejected",
    }


    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    server_id = models.BigIntegerField(primary_key=True)
    server_name = models.CharField(max_length=50)
    server_description = models.TextField()
    server_interests = models.TextField()
    status = models.CharField(choices=STATUS, default='pending')
    updated_at = models.DateTimeField()
    created_at = models.DateTimeField()
    delete_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.server_name




class Archived_Servers(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    server_id = models.BigIntegerField(primary_key=True)
    server_name = models.CharField(max_length=50)
    server_description = models.TextField()
    server_interests = models.CharField()
    updated_at = models.DateTimeField()
    created_at = models.DateTimeField()
    deleted_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.server_name