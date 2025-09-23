from django.db.models.signals import pre_delete
from django.dispatch import receiver
from lessons.models import Lessons, Archived_Lessons

@receiver(pre_delete, sender=Lessons)
def archive_lesson_on_delete(sender, instance, **kwargs):
    Archived_Lessons.objects.create(
        user=instance.user,
        teacher=instance.teacher,
        lesson_id=instance.lesson_id,
        lesson_title=instance.lesson_id,
        lesson_category=instance.lesson_category,
        lesson_description=instance.lesson_description,
        is_active=instance.is_active,
        repeating=instance.repeating,
        start_date=instance.start_date,
        end_date=instance.end_date,
        updated_at=instance.updated_at,
        created_at=instance.created_at
    )