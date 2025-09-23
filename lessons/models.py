from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from teachers.models import Teachers
import uuid

# Create your models here.

class Lessons(models.Model):
    CATEGORIES = [
        ('history', 'History'),
        ('psychology', 'Psychology'),
        ('computer science', 'Computer Science'),
        ('math', 'Math'),
        ('physics', 'Physics'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    teacher = models.ForeignKey(Teachers, on_delete=models.CASCADE)
    lesson_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson_title = models.CharField(max_length=200)
    lesson_category = models.CharField(choices=CATEGORIES)
    lesson_description = models.TextField()
    banner = models.ImageField(upload_to='lesson_banner', default='lesson_banner/default_banner.jpg',blank=True)
    is_active = models.BooleanField(default=True)
    repeating = models.BooleanField(default=False, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Lesson"
        verbose_name_plural = "Lessons"

    def __str__(self):
        return self.lesson_title

class Teacher_Availability(models.Model):
    DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    teacher = models.ForeignKey(Teachers, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lessons, on_delete=models.CASCADE)
    day = models.CharField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Teacher Availability"
        verbose_name_plural = "Teacher Availability"
        unique_together = ('teacher', 'day', 'start_time', 'end_time')






class Archived_Lessons(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    teacher = models.ForeignKey(Teachers, on_delete=models.SET_NULL, null=True)
    lesson_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson_title = models.CharField(max_length=200)
    lesson_category = models.CharField(max_length=200)
    lesson_description = models.TextField()
    banner = models.ImageField(blank=True)
    is_active = models.BooleanField()
    repeating = models.BooleanField(default=False, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    updated_at = models.DateTimeField()
    created_at = models.DateTimeField()
    delete_at = models.DateTimeField(auto_now_add=True)


class Archived_Teacher_Availability(models.Model):
    DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    teacher = models.ForeignKey(Teachers, on_delete=models.SET_NULL, null=True, blank=True)
    lesson = models.ForeignKey(Lessons, on_delete=models.SET_NULL, null=True, blank=True)
    day = models.CharField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    updated_at = models.DateTimeField()
    created_at = models.DateTimeField()
    deleted_at = models.DateTimeField(auto_now_add=True)

