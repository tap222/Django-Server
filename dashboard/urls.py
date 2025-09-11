from django.urls import path, include
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('admin/', views.admin_dashboard, name='admin'),
    path('admin/settings/', views.admin_dashboard_settings, name='admin_settings'),
    path('admin/roles/', views.admin_dashboard_roles, name='roles'),
    path('admin/server/applications', views.admin_dashboard_server_application_view, name='server_applications'),
    path('admin/teacher/applications', views.admin_dashboard_teacher_application_view, name='teacher_applications'),
    path('admin/servers', views.admin_dashboard_servers, name='admin_servers'),
    path('admin/teachers', views.admin_dashboard_teachers, name='admin_teachers'),
    path('admin/events', views.admin_dashboard_events, name='admin_events'),
    path('server/', views.server_dashboard, name='server'),
    path('server/settings/', views.server_dashboard_settings, name='server_settings'),
    path('server/events/', views.server_dashboard_events, name='server_events'),
    path('teacher/', views.teacher_dashboard, name='teacher'),
    path('student/', views.student_dashboard, name='student'),
    path('student/settings/', views.student_dashboard_settings, name='student_settings'),
    path('student/tickets/', views.student_dashboard_tickets, name='student_tickets'),

    
]