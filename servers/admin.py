from django.contrib import admin
from servers.models import Server_Application, Servers

# Register your models here.

admin.site.register(Server_Application)
admin.site.register(Servers)
