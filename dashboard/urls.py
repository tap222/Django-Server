from django.urls import path, include
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    #ADMIN
    path('admin/', views.admin_dashboard, name='admin'),
    path('admin/settings/', views.admin_dashboard_settings, name='admin_settings'),
    path('admin/groups/', views.admin_dashboard_roles, name='groups'),

    path('admin/servers', views.admin_dashboard_servers, name='admin_servers'),
    path('admin/servers/<int:server_id>', views.admin_dashboard_server_view, name='server_view'),
    path('admin/servers/delete/<int:server_id>', views.admin_dashboard_server_delete, name='server_delete'),

    path('admin/server/applications', views.admin_dashboard_server_applications, name='server_applications'),
    path('admin/server/application/<int:server_id>', views.admin_dashboard_server_application_view , name='server_application_view'),
    path('admin/server/application/accept/<int:server_id>', views.admin_dashboard_teacher_application_accept, name='server_application_accept'),
    path('admin/server/application/reject/<int:server_id>', views.admin_dashboard_teacher_application_reject, name='server_application_reject'),
    
    path('admin/teachers', views.admin_dashboard_teachers, name='admin_teachers'),
    path('admin/teachers/<uuid:teacher_id>', views.admin_dashboard_teacher_view, name='admin_teacher_view'),
    path('admin/teacher/applications', views.admin_dashboard_teacher_applications, name='teacher_applications'),
    path('admin/teacher/applications/<uuid:application_id>', views.admin_dashboard_teacher_application_view, name='teacher_application_view'),
    path('admin/teacher/applications/accept/<uuid:application_id>', views.admin_dashboard_teacher_application_accept, name='teacher_application_accept'),
    path('admin/teacher/applications/reject/<uuid:application_id>', views.admin_dashboard_teacher_application_reject, name='teacher_application_reject'),

    path('admin/events', views.admin_dashboard_events, name='admin_events'),
    #SERVERS
    path('server/', views.server_dashboard, name='server'),
    path('server/settings/', views.server_dashboard_settings, name='server_settings'),
    path('server/events/', views.server_dashboard_events, name='server_events'),
    #TEACHERS
    path('teacher/', views.teacher_dashboard, name='teacher'),
    path('teacher/lessons/', views.teacher_dashboard_lessons, name='teacher_lessons'),
    path('teacher/lessons/<uuid:lesson_id>', views.teacher_dashboard_lesson_view, name='teacher_lesson_view'),
    path('teacher/lessons/create', views.teacher_dashboard_create_lesson, name='teacher_create_lesson'),
    #STUDENTS
    path('student/', views.student_dashboard, name='student'),
    path('student/settings/', views.student_dashboard_settings, name='student_settings'),
    path('student/tickets/', views.student_dashboard_tickets, name='student_tickets'),

    
]