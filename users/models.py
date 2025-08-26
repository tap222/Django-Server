from django.db import models

# Create your models here.

class Users(models.Model):
    title = models.CharField()
    description = models.TextField()
    id = models.UUIDField(primary_key=True)