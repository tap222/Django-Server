from django.urls import path, include
from lessons import views
from django.contrib.auth.decorators import login_required


app_name = 'lessons'

urlpatterns = [
    path('', views.lessons, name='lessons'),
    path('details/<uuid:lesson_id>', views.lesson_view, name='lesson_view'),
    path('book/<uuid:lesson_id>', views.lesson_book, name='lesson_book')

]