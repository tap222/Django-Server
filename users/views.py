# Django
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import logout as auth_logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User

# REST framework
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# dj rest auth
from  dj_rest_auth.registration.views import SocialLoginView

# allauth
from allauth.socialaccount.providers.discord.views import DiscordOAuth2Adapter

# Serializers
from .serializers import *

# Create your views here.
def register(request):
    form = UserCreationForm()
    return render(request, "users/register.html")

def login(request):
    return redirect('/accounts/discord/login/')
    # return render(request, 'users/login.html')


# a view for logging out
def logout(request):
    auth_logout(request)
    return redirect('/')


# @permission_classes([IsAuthenticated])
# class GetCurrentUser(viewsets.ReadOnlyModelViewSet):
#     """
#         Get the current user's information
#     """

#     queryset = User.objects.all()
#     serializer_class = CurrentUserSerializer
#     permission_classes = [IsAuthenticated]

#     @action(detail=False, method=['GET'], url_path='me')
#     def me(self, request):
#         serializer = self.get_serializer(request.user)
#         return Response(serializer.data)
    
@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
        Get the logged-in user's information (also sets the CSRF cookie for the Nuxt app)
    """
    return Response(CurrentUserSerializer(request.user).data)


class DiscordLogin(SocialLoginView):
    adapter_class = DiscordOAuth2Adapter