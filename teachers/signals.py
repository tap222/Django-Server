from django.db.models.signals import pre_delete
from django.dispatch import receiver
from teachers.models import Teachers, Teacher_Applications, Archived_Teacher_Applications, Archived_Teachers




@receiver(pre_delete, sender=Teacher_Applications)
def archive_teacher_application_on_delete(sender, instance, **kwargs):
    Archived_Teacher_Applications.objects.create(
        application_id=instance.application_id,
        user=instance.user,
        teacher_id=instance.teacher_id,
        first_name=instance.first_name,
        last_name=instance.last_name,
        date_of_birth=instance.date_of_birth,
        gender=instance.gender,
        expertise=instance.expertise,
        status=instance.status,
        updated_at=instance.updated_at,
        created_at=instance.created_at
    )


@receiver(pre_delete, sender=Teachers)
def archive_teacher_on_delete(sender, instance, **kwargs):
    Archived_Teachers.objects.create(
        user=instance.user,
        teacher_id=instance.teacher_id,
        first_name=instance.first_name,
        last_name=instance.last_name,
        date_of_birth=instance.date_of_birth,
        gender=instance.gender,
        expertise=instance.expertise,
        updated_at=instance.updated_at,
        created_at=instance.created_at
    )