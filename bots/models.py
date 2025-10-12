from django.db import models
from servers.models import Servers

# Create your models here.

class Bots(models.Model):
    bot_id = models.BigIntegerField(primary_key=True)
    bot_self_token = models.CharField()
    server = models.ForeignKey(Servers, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Bot"
        verbose_name_plural = "Bots"

    def __str__(self):
        return self.server.server_name