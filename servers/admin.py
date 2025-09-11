from django.contrib import admin
from servers.models import Server_Applications, Servers

# Register your models here.


admin.site.register(Servers)
admin.site.register(Server_Applications)