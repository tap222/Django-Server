from django.urls import path, include
from . import views

# REST framework
from rest_framework.routers import DefaultRouter

app_name = 'users'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    # dj_rest_auth endpoints
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/me/', views.current_user, name='current_user'),
    path('api/auth/discord/', views.DiscordLogin.as_view(), name= 'discord_login'),
]

router = DefaultRouter()

urlpatterns += router.urls