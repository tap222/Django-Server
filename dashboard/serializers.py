from django.contrib.auth.models import Group, User
from rest_framework import serializers

from servers.models import Server_Applications
from teachers.models import Teacher_Applications



class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            "name",
            "permissions"
            ]
        

class ServerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Server_Applications
        fields = [
            "user",
            "first_name",
            "last_name",
            "server_id",
            "server_name",
            "server_description",
            "server_interests",
            "status",
            "created_at"
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
