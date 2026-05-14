from django.contrib.auth.models import Group, User
from rest_framework import serializers

from teachers.models import Teacher_Applications


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            "name",
            "permissions"
            ]

class TeacherApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher_Applications
        fields = [
            "application_id",
             "user",
             "teacher_id",
             "first_name",
             "last_name",
             "date_of_birth",
             "gender",
             "expertise",
             "status", 
             "created_at"
             ]
