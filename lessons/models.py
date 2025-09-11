from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from teachers.models import Teachers
import uuid

# Create your models here.

class Lessons(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    teacher_id = models.ForeignKey(Teachers, on_delete=models.CASCADE)
    lesson_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson_title = models.CharField(max_length=200)
    lesson_category = models.CharField(max_length=200)
    lesson_description = models.TextField()
    is_active = models.BooleanField()
    repeating = models.BooleanField()
    availability = models.JSONField()
    start_date = models.DateField()
    end_date = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Lesson"
        verbose_name_plural = "Lessons"