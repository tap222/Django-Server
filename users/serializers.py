from django.contrib.auth.models import Group, User

# REST framework
from rest_framework import serializers

class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'groups'
        ]

