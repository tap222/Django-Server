from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Servers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    server_id = models.BigIntegerField(primary_key=True)
    server_name = models.CharField(max_length=50)
    server_description = models.TextField()
    server_interests = models.CharField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.server_name


class Server_Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    server_id = models.BigIntegerField(\
        primary_key=True,
        # validators=[MaxLengthValidator(20), MinLengthValidator(18)]
    )
    server_name = models.CharField(max_length=50)
    server_description = models.TextField()
    server_interests = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.server_name