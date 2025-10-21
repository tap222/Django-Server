from functools import wraps
from django.conf import settings
from django.http import HttpResponseForbidden


def _normalize_host(host):
    if not host:
        return ''
    # strip port
    return host.split(':')[0].lower()


def same_origin_required(view_func):
    """Decorator that ensures requests originate from same host.

    Checks the Origin and Referer headers (if present) and compares their
    host component to request.get_host(). In DEBUG mode the decorator will
    allow requests from localhost (127.0.0.1) to make local testing easier.

    Returns 403 Forbidden when the check fails.
    """

    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        # Allow safe methods through (GET is fine, but you may tighten this)
        origin = request.META.get('HTTP_ORIGIN')
        referer = request.META.get('HTTP_REFERER')
        host = _normalize_host(request.get_host())

        def host_from_url(url):
            if not url:
                return None
            # url may be like 'http://example.com:8000/path'
            try:
                # Lazy parse without importing urlparse at module import time
                from urllib.parse import urlsplit
                return _normalize_host(urlsplit(url).hostname)
            except Exception:
                return None

        origin_host = host_from_url(origin)
        referer_host = host_from_url(referer)

        # Allow if any header matches host
        if origin_host == host or referer_host == host:
            return view_func(request, *args, **kwargs)

        # Allow localhost during development
        if settings.DEBUG:
            if host in ('127.0.0.1', 'localhost') or origin_host in ('127.0.0.1', 'localhost') or referer_host in ('127.0.0.1', 'localhost'):
                return view_func(request, *args, **kwargs)

        return HttpResponseForbidden('Cross-site requests are not allowed.')

    return _wrapped
