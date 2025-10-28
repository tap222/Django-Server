from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.

class Teachers(models.Model):
    GENDERS = {
        "female": "Female",
        "male": "Male",
        "other": "Other",
    }



    user = models.ForeignKey(User, on_delete=models.CASCADE)
    teacher_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender = models.CharField(choices=GENDERS)
    expertise = models.CharField(max_length=300)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Teacher"
        verbose_name_plural = "Teachers"

    def __str__(self):
        return self.user.username


class Teacher_Applications(models.Model):
    GENDERS = {
        "female": "Female",
        "male": "Male",
        "other": "Other",
    }

    STATUS = {
        "pending": "Pending",
        "accepted": "Accepted",
        "rejected": "Rejected",
    }

    application_id = models.UUIDField(default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    teacher_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender = models.CharField(choices=GENDERS)
    expertise = models.CharField(max_length=300)
    status = models.CharField(choices=STATUS, default='pending')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        verbose_name = "Teacher Application"
        verbose_name_plural = "Teacher Applications"



class Archived_Teachers(models.Model):
    GENDERS = {
        "female": "Female",
        "male": "Male",
        "other": "Other",
    }



    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    teacher_id = models.UUIDField(primary_key=True, editable=False)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender = models.CharField(choices=GENDERS)
    expertise = models.CharField(max_length=300)
    updated_at = models.DateTimeField()
    created_at = models.DateTimeField()
    deleted_at = models.DateTimeField(auto_now_add=True)





class Archived_Teacher_Applications(models.Model):
    GENDERS = {
        "female": "Female",
        "male": "Male",
        "other": "Other",
    }

    STATUS = {
        "pending": "Pending",
        "accepted": "Accepted",
        "rejected": "Rejected",
    }

    application_id = models.UUIDField(editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    teacher_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender = models.CharField(choices=GENDERS)
    expertise = models.CharField(max_length=300)
    status = models.CharField(choices=STATUS, default='pending')
    updated_at = models.DateTimeField()
    created_at = models.DateTimeField()
    deleted_at = models.DateTimeField(auto_now_add=True)


