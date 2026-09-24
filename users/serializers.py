from django.contrib.auth.models import Group, User

# REST framework
from rest_framework import serializers

class GroupNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']


class CurrentUserSerializer(serializers.ModelSerializer):
    groups = GroupNameSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_superuser',
            'groups'
        ]

