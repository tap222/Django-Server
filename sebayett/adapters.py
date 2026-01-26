from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.shortcuts import redirect
from django.conf import settings
from django.urls import reverse

class MySocialAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # This triggers when returning FROM Discord
        if request.user.is_authenticated:
            # You might want to link the account here, 
            # but if you want them gone:
            raise ImmediateHttpResponse(redirect(settings.LOGIN_REDIRECT_URL))