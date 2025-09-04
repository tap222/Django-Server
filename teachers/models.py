from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.

class Teachers(models.Model):
    GENDERS = {
        "F": "Female",
        "M": "Male",
        "O": "Other",
    }


    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    teacher_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDERS)
    expertise = models.CharField(max_length=300)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


class TeacherApplications(models.Model):
    GENDERS = {
        "F": "Female",
        "M": "Male",
        "O": "Other",
    }


    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    teacher_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDERS)
    expertise = models.CharField(max_length=300)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)