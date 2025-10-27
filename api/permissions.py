from rest_framework import permissions
from django.conf import settings
import os

class BotKeyPermission(permissions.BasePermission):
    """
    Custom permission to only allow requests with valid bot API key.
    Checks X-Bot-Key header against BOT_API_KEY environment variable.
    """
    
    def has_permission(self, request, view):
        bot_key = request.headers.get('X-Bot-Key')
        expected_key = os.getenv('BOT_API_KEY') or getattr(settings, 'BOT_API_KEY', None)
        
        if not expected_key:
            # If no key is configured, deny all access
            return False
            
        return bot_key == expected_key
