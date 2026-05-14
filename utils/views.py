from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets

from utils.serializers import GroupSerializer, UserSerializer

class userViewSet(viewsets.ModelViewSet):
    """
    API endpoit that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]



class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    quieryset= Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]