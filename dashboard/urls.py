from django.urls import path, include
from . import views

# REST framework
from rest_framework.routers import DefaultRouter

app_name = 'dashboard'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    #ADMIN
    path('admin/', views.admin_dashboard, name='admin'),
    path('admin/settings/', views.admin_dashboard_settings, name='admin_settings'),
    #path('admin/groups/', views.admin_dashboard_roles, name='groups'),
    #ADMIN servers
    path('admin/servers/', views.admin_dashboard_servers, name='admin_servers'),
    path('admin/servers/<int:server_id>/', views.admin_dashboard_server_view, name='server_view'),
    path('admin/servers/delete/<int:server_id>/', views.admin_dashboard_server_delete, name='server_delete'),
    #ADMIN server applications
    # path('admin/server/applications', views.admin_dashboard_server_applications, name='server_applications'),
    # path('admin/server/applications/<int:server_id>', views.admin_dashboard_server_application_view , name='server_application_view'),
    # path('admin/server/applications/accept/<int:server_id>', views.admin_dashboard_server_application_accept, name='server_application_accept'),
    # path('admin/server/applications/reject/<int:server_id>', views.admin_dashboard_server_application_accept, name='server_application_reject'),
    #ADMIN bots
    path('admin/bots/', views.admin_dashboard_discord_bots, name='discord_bots'),
    path('admin/bots/add/', views.admin_dashboard_add_discord_bot, name='add_discord_bot'),
    path('admin/bots/<int:bot_id>', views.admin_dashboard_discord_bot_view, name='discord_bot_view'),
    path('admin/bots/remove/<int:bot_id>', views.admin_dashboard_remove_discord_bot, name='remove_discord_bot'),
    #ADMIN teachers 
    path('admin/teachers', views.admin_dashboard_teachers, name='admin_teachers'),
    path('admin/teachers/<uuid:teacher_id>', views.admin_dashboard_teacher_view, name='admin_teacher_view'),
    #ADMIN teacher applications
    path('admin/teacher/applications', views.admin_dashboard_teacher_applications, name='teacher_applications'),
    path('admin/teacher/applications/<uuid:application_id>', views.admin_dashboard_teacher_application_view, name='teacher_application_view'),
    path('admin/teacher/applications/accept/<uuid:application_id>', views.admin_dashboard_teacher_application_accept, name='teacher_application_accept'),
    path('admin/teacher/applications/reject/<uuid:application_id>', views.admin_dashboard_teacher_application_reject, name='teacher_application_reject'),
    #ADMIN events
    path('admin/events', views.admin_dashboard_events, name='admin_events'),

    #SERVERS
    path('server/', views.server_dashboard, name='server'),
    path('server/settings/', views.server_dashboard_settings, name='server_settings'),
    path('server/events/', views.server_dashboard_events, name='server_events'),

    #TEACHERS
    path('teacher/', views.teacher_dashboard, name='teacher'),
    #TEACHERS lessons
    path('teacher/lessons/', views.teacher_dashboard_lessons, name='teacher_lessons'),
    path('teacher/lessons/<uuid:lesson_id>', views.teacher_dashboard_lesson_view, name='teacher_lesson_view'),
    path('teacher/lessons/create', views.teacher_dashboard_create_lesson, name='teacher_create_lesson'),
    path('teacher/lessons/<uuid:lesson_id>/activity', views.teacher_dashboard_lesson_pause, name='teacher_lesson_pause'),
    #TEACHER events
    path('teacher/events/', views.teacher_dashboard_events, name='teacher_events'),
    path('teacher/events/<uuid:event_id>', views.teacher_dashboard_event_details, name='teacher_event_details'),
    path('teacher/events/accept/<uuid:event_id>', views.teacher_dashboard_event_accept, name='teacher_event_accept'),
    path('teacher/events/reject/<uuid:event_id>', views.teacher_dashboard_event_reject, name='teacher_event_reject'),

    #STUDENTS
    path('student/', views.student_dashboard, name='student'),
    path('student/settings/', views.student_dashboard_settings, name='student_settings'),
    path('student/tickets/', views.student_dashboard_tickets, name='student_tickets'),
]

router = DefaultRouter()

# router registration
router.register('admin/groups', views.AdminDashboardRoles, basename='groups')
router.register('admin/server/applications',views.AdminDashboardServerApplications, basename='server_application')

urlpatterns += router.urls




