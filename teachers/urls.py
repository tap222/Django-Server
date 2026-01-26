from django.urls import path, include
from . import views

app_name = 'teachers'

urlpatterns = [
    path('apply/', views.teacher_apply, name='application'),
    path('details/instructor/<int:instructor_id>/', views.instructor_details, name='instructor_details'),

]