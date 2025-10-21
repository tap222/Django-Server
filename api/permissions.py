import os
from rest_framework.permissions import BasePermission


class BotKeyPermission(BasePermission):
    """Permission that verifies a shared secret in X-Bot-Key header.

    The bot running on the same machine should attach this header to requests.
    The shared secret is read from the environment variable BOT_API_KEY.

    This is a simple, low-friction approach. It's not as strong as mTLS or
    firewall rules, but it's easy to implement and adequate for trusted local
    communications when combined with other controls (bind to localhost, use
    a host-only network, or set firewall rules).
    """

    def has_permission(self, request, view):
        expected = os.getenv('BOT_API_KEY')
        if not expected:
            # If no key configured, deny by default
            return False
        provided = request.META.get('HTTP_X_BOT_KEY')
        return provided == expected
