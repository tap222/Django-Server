from django.db.models.signals import pre_delete
from django.dispatch import receiver
from servers.models import Servers, Server_Applications, Archived_Server_Applications, Archived_Servers

@receiver(pre_delete, sender=Server_Applications)
def archive_server_application_on_delete(sender, instance, **kwargs):
    Archived_Server_Applications.objects.create(
        user=instance.user,
        first_name=instance.first_name,
        last_name=instance.last_name,
        server_id=instance.server_id,
        server_name=instance.server_name,
        server_description=instance.server_description,
        server_interests=instance.server_interests,
        status=instance.status,
        updated_at=instance.updated_at,
        created_at=instance.created_at
    )



@receiver(pre_delete, sender=Servers)
def archive_server_on_delete(sender, instance, **kwargs):
    Archived_Servers.objects.create(
        user=instance.user,
        first_name=instance.first_name,
        last_name=instance.last_name,
        server_id=instance.server_id,
        server_name=instance.server_name,
        server_description=instance.server_description,
        server_interests=instance.server_interests,
        updated_at=instance.updated_at,
        created_at=instance.created_at
    )
