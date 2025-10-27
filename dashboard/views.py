from django.shortcuts import render, redirect
from django.http import HttpResponse
from servers.models import Server_Applications, Servers
from teachers.models import Teacher_Applications, Teachers
from lessons.models import Lessons, Teacher_Availability
from events.models import Events
from bots.models import Bots
from bots.forms import AddBot
from tickets.models import Tickets
from lessons import forms
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group



# Create your views here.

@login_required(login_url='users:login')
def dashboard(request):

    if request.user.groups.filter(name='Admin').exists():
        return redirect('dashboard:admin')
    elif request.user.groups.filter(name='Server').exists():
        return redirect('dashboard:server')
    elif request.user.groups.filter(name='Teacher').exists():
        return redirect('dashboard:teacher')
    else:
        return redirect('dashboard:student')
    
    return redirect('dashboard:dashboard')



####################################ADMIN SECTION####################################


def admin_dashboard(request):
    if request.user.groups.filter(name='Admin').exists():
        server_applications_count = Server_Applications.objects.count()
        teacher_applications_count = Teacher_Applications.objects.count()

        return render(request, 'dashboard/admin/adminDashboard.html', {
            'server_applications_count': server_applications_count,
            'teacher_applications_count': teacher_applications_count,

            })
    
    return redirect('dashboard:dashboard')



@login_required(login_url='users:login')
def admin_dashboard_settings(request):
    if request.user.groups.filter(name='Admin').exists():
        return render(request, 'dashboard/admin/adminSettings.html')
        
    return('/')



@login_required(login_url='users:login')
def admin_dashboard_roles(request):
    if request.user.groups.filter(name='Admin').exists():
        groups = Group.objects.all()
        return render(request, 'dashboard/admin/rolesView.html', {'groups': groups})
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def admin_dashboard_server_applications(request):
    if request.user.groups.filter(name='Admin').exists():
        server_applications = Server_Applications.objects.all()
        
        return render(request, 'dashboard/admin/serverApplications.html', { 'applications': server_applications })
    return redirect('dashboard:dashboard')




@login_required(login_url='users:login')
def admin_dashboard_server_application_view(request, server_id):
    if request.user.groups.filter(name='Admin').exists():
        server_application = Server_Applications.objects.filter(server_id=server_id).first()
        
        return render(request, 'dashboard/admin/serverApplicationView.html', { 'application': server_application })
    return redirect('dashboard:dashboard')



@login_required(login_url='users:login')
def admin_dashboard_server_application_accept(request, server_id):
    if request.method == 'POST':
        if request.user.groups.filter(name='Admin').exists():
            server_application = Server_Applications.objects.filter(server_id=server_id).first()

            if not server_application:
                return HttpResponse("""
                                    <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                        <h3 class="text-sm sm:text-lg font-semibold">Server Application Not Found</h3>
                                    </div>
                                    """)
                                    
            else:
                server_application.status = 'accepted'
                server_application.save()

                server = Servers(
                    user=server_application.user, 
                    first_name=server_application.first_name,
                    last_name=server_application.last_name,
                    server_id=server_application.server_id,
                    server_name=server_application.server_name,
                    server_description=server_application.server_description,
                    server_interests=server_application.server_interests
                    )
                server.save()
                
                user = server_application.user
                group, _ = Group.objects.get_or_create(name='Server')
                user.groups.add(group)
                user.save()

                server_application.delete()
            
                return HttpResponse("""
                                    <div class="bg-green-100 p-4 rounded shadow text-center">
                                        <h3 class="text-sm sm:text-lg font-semibold">Server Accepted</h3>
                                    </div>
                                    """)


    return redirect('dashboard:dashboard')
    

@login_required(login_url='users:login')
def admin_dashboard_server_application_reject(request, server_id):
    if request.user.groups.filter(name='Admin').exists():
        if request.method == 'POST':
            server_application = Server_Applications.objects.filter(server_id=server_id).first()

            if not server_application:
                    return HttpResponse("""
                                        <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                            <h3 class="text-sm sm:text-lg font-semibold">Server Application Not Found</h3>
                                        </div>
                                        """)
            else:
                server_application.status = 'rejected'
                server_application.save()
                server_application.delete()

                return HttpResponse("""
                                    <div class="bg-red-100 p-4 rounded shadow text-center">
                                        <h3 class="text-sm sm:text-lg font-semibold">Server Rejected</h3>
                                    </div>
                                    """)

        return redirect('base:home')



@login_required(login_url='users:login')
def admin_dashboard_server_view(request, server_id):
    if request.user.groups.filter(name='Admin').exists():
        server = Servers.objects.filter(server_id=server_id).first()
        if not server:
            return redirect('dashborad:admin_servers')
        return render(request, 'dashboard/admin/serverView.html', { 'server': server})
    return redirect('dashboard:dashboard')

    

@login_required(login_url='users:login')
def admin_dashboard_server_delete(request, server_id):
    if request.user.groups.filter(name='Admin').exists():
        if request.method == 'POST':
            server = Servers.objects.filter(server_id=server_id).first()
            if not server:
                return HttpResponse("""
                                        <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                            <h3 class="text-sm sm:text-lg font-semibold">Server Not Found</h3>
                                        </div>
                                    """)
            else:
                user = server.user
                if user.groups.filter(name='Server').exists():
                    group = Group.objects.get(name='Server')
                    user.groups.remove(group)


                server.delete()
                return HttpResponse("""
                                    <div class="bg-red-100 p-4 rounded shadow text-center">
                                        <h3 class="text-sm sm:text-lg font-semibold">Server Deleted</h3>
                                    </div>
                                    """)





@login_required(login_url='users:login')
def admin_dashboard_servers(request):
    if request.user.groups.filter(name='Admin').exists():
        servers = Servers.objects.all()
        
        return render(request, 'dashboard/admin/servers.html', { 'servers': servers})
    
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def admin_dashboard_discord_bots(request):
    if request.user.groups.filter(name='Admin').exists():
        bots = Bots.objects.all()

        return render(request, 'dashboard/admin/bots.html', { 'bots': bots })
    
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def admin_dashboard_add_discord_bot(request):
    if request.user.groups.filter(name='Admin').exists():
        if request.method == 'POST':
            form = AddBot(request.POST)
            if form.is_valid():
                form.save()
                return redirect('dashboard:discord_bots')
        else:
            form = AddBot()
        return render(request, 'dashboard/admin/addBot.html', { 'form': form })

@login_required(login_url='users:login')
def admin_dashboard_discord_bot_view(request, bot_id):
    if request.user.groups.filter(name='Admin').exists():
        bot = Bots.objects.filter(bot_id=bot_id).first()
        server = Servers.objects.filter(server_id=bot.server_id).first()
        return render(request, 'dashboard/admin/botView.html', { 
            'bot': bot,
            'server': server,
            })


@login_required(login_url='users:login')
def admin_dashboard_remove_discord_bot(request, bot_id):
    if request.user.groups.filter(name='Admin').exists():
        if request.method == 'POST':
            bot = Bots.objects.filter(bot_id=bot_id).first()
            if bot:
                bot.delete()
                return HttpResponse("""
                                        <div class="bg-red-100 p-4 rounded shadow text-center">
                                            <h3 class="text-sm sm:text-lg font-semibold">Self Bot has been deleted</h3>
                                        </div>
                                    """)
            else:
                return HttpResponse("""
                                        <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                            <h3 class="text-sm sm:text-lg font-semibold">Self Bot Not Found</h3>
                                        </div>
                                    """)







@login_required(login_url='users:login')
def admin_dashboard_teacher_applications(request):
    if request.user.groups.filter(name='Admin').exists():
        applications = Teacher_Applications.objects.all()

        return render(request, 'dashboard/admin/teacherApplications.html', { 'applications': applications })
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def admin_dashboard_teacher_application_view(request, application_id):
    if request.user.groups.filter(name='Admin').exists():
        application = Teacher_Applications.objects.filter(application_id=application_id).first()

        return render(request, 'dashboard/admin/teacherApplicationView.html', { 'application' : application })




@login_required(login_url='users:login')
def admin_dashboard_teacher_application_accept(request, application_id):
    if request.user.groups.filter(name='Admin').exists():
        if request.method == 'POST':
            teacher_application = Teacher_Applications.objects.filter(application_id=application_id).first()
            if not teacher_application:
                return HttpResponse("""
                                        <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                            <h3 class="text-sm sm:text-lg font-semibold">Teacher Application Not Found</h3>
                                        </div>
                                    """)
            else:
                teacher_application.status = "accepted"
                teacher_application.save()

                teacher = Teachers(
                        user=teacher_application.user, 
                        teacher_id=teacher_application.teacher_id,
                        first_name=teacher_application.first_name,
                        last_name=teacher_application.last_name,
                        date_of_birth=teacher_application.date_of_birth,
                        gender=teacher_application.gender,
                        expertise=teacher_application.expertise
                        )
                teacher.save()

                
                user = teacher.user
                
                group, _ = Group.objects.get_or_create(name='Teacher')
                user.groups.add(group)
                user.save()

                teacher_application.delete()

                return HttpResponse("""
                                        <div class="bg-green-100 p-4 rounded shadow text-center">
                                            <h3 class="text-sm sm:text-lg font-semibold">Teacher Accepted</h3>
                                        </div>
                                        """)

        return redirect('base:home')


@login_required(login_url='users:login')
def admin_dashboard_teacher_application_reject(request, application_id):
    if request.user.groups.filter(name='Admin').exists():
        if request.method == 'POST':
            teacher_application = Teacher_Applications.objects.filter(application_id=application_id).first()
            if not application:
                return HttpResponse("""
                                        <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                            <h3 class="text-sm sm:text-lg font-semibold">Teacher Application Not Found</h3>
                                        </div>
                                    """)
            else:
                teacher_application.status = "rejected"
                teacher_application.save()
                teacher_application.delete()
                return HttpResponse("""
                                    <div class="bg-red-100 p-4 rounded shadow text-center">
                                        <h3 class="text-sm sm:text-lg font-semibold">Teacher Rejected</h3>
                                    </div>
                                    """)

        return redirect('base:home')







@login_required(login_url='users:login')
def admin_dashboard_teachers(request):
    if request.user.groups.filter(name='Admin').exists():
        teachers = Teachers.objects.all()

        return render(request, 'dashboard/admin/teachers.html', { 'teachers': teachers })
    
    return redirect('dashboard:dashboard')



@login_required(login_url='users:login')
def admin_dashboard_teacher_view(request, teacher_id):
    if request.user.groups.filter(name='Admin').exists():
        teacher = Teachers.objects.filter(teacher_id=teacher_id).first()

        return render(request, 'dashboard/admin/teacherView.html', { 'teacher': teacher })
    
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def admin_dashboard_teacher_delete(request, teacher_id):
    if request.user.groups.filter(name='Admin').exists():
        if request.method == 'POST':
            teacher = Teachers.objects.filter(teacher_id=teacher_id).first()
            if not teacher:
                return HttpResponse("""
                                        <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                            <h3 class="text-sm sm:text-lg font-semibold">Teacher Not Found</h3>
                                        </div>
                                    """)
            else:
                user = teacher.user
                if user.groups.filter(name='Teacher').exists():
                    group = Group.objects.get(name='Teacher')
                    user.groups.remove(group)

                teacher.delete()

                return HttpResponse("""
                                    <div class="bg-red-100 p-4 rounded shadow text-center">
                                        <h3 class="text-sm sm:text-lg font-semibold">Teacher Deleted</h3>
                                    </div>
                                    """)
    return redirect('base:home')
    





@login_required(login_url='users:login')
def admin_dashboard_events(request):
    if request.user.groups.filter(name='Admin').exists():
        events = None        
        return render(request, 'dashboard/admin/adminEvents.html', { 'events': events})
    
    return redirect('dashboard:dashboard')



####################################SERVER SECTION####################################

@login_required(login_url='users:login')
def server_dashboard(request):
    if request.user.groups.filter(name='Server').exists():
        return render(request, 'dashboard/servers/serverDashboard.html')
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def server_dashboard_settings(request):
    if request.user.groups.filter(name='Server').exists():
        return render(request, 'dashboard/servers/serverSettings.html')
    return redirect('dashboard:dashboard')

@login_required(login_url='users:login')
def server_dashboard_events(request):
    if request.user.groups.filter(name='Server').exists():
        events = None
        return render(request, 'dashboard/servers/manageServerEvents.html', { 'events': events})
    
    return redirect('dashboard:dashboard')





####################################TEACHER SECTION####################################

@login_required(login_url='users:login')
def teacher_dashboard(request):
    if request.user.groups.filter(name="Teacher").exists():
        lessons = Lessons.objects.filter(user=request.user)
        pending_events_count = Events.objects.filter(lesson__user=request.user, event_status='PENDING').count()
        return render(request, 'dashboard/teachers/teacherDashboard.html', { 
            'lessons': lessons,
            'pending_events_count': pending_events_count
            })
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def teacher_dashboard_lessons(request):
    if request.user.groups.filter(name="Teacher").exists():
        lessons = Lessons.objects.filter(user=request.user)
        return render(request, 'dashboard/teachers/teacherLessons.html', { 'lessons': lessons })
    return redirect('dashboard:dashboard')

@login_required(login_url='users:login')
def teacher_dashboard_lesson_view(request, lesson_id):
    if request.user.groups.filter(name="Teacher").exists():
        lesson = Lessons.objects.filter(lesson_id=lesson_id).first()
        availability = Teacher_Availability.objects.filter(lesson_id=lesson_id)
        return render(request, 'dashboard/teachers/teacherLessonView.html', { 
            'lesson': lesson,
            'availability': availability
            })
    return redirect('dashboard:dashboard')





@login_required(login_url='users:login')
def teacher_dashboard_create_lesson(request):
    if request.user.groups.filter(name="Teacher").exists():
        if request.method == 'POST':
            # get teacher instance and pass it to the form so the form can handle saving
            teacher = Teachers.objects.filter(user=request.user).first()
            if not teacher:
                return HttpResponse("<div class=\"bg-yellow-100 p-4 rounded shadow text-center\">\n                                        <h3 class=\"text-sm sm:text-lg font-semibold\">Teacher profile not found</h3>\n                                    </div>", status=400)

            form = forms.CreateLesson(request.POST, request.FILES, teacher=teacher)
            if form.is_valid():
                # form.save() will create the lesson and availability rows and return the lesson
                lesson = form.save()
                return redirect('dashboard:teacher_lessons')
        else:
            # for GET, pass the teacher instance so widgets/validation that rely on it can behave consistently
            teacher = Teachers.objects.filter(user=request.user).first()
            form = forms.CreateLesson(teacher=teacher)
        return render(request, 'dashboard/teachers/createLesson.html', {
            'form': form,
            })
    return redirect('dashboard:dashboard')





@login_required(login_url='users:login')
def teacher_dashboard_events(request):
    if request.user.groups.filter(name="Teacher").exists():
        events = Events.objects.filter(user=request.user)
        return render(request, 'dashboard/teachers/teacherEvents.html', {
            'events': events
        })
    
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def teacher_dashboard_event_details(request, event_id):
    if request.user.groups.filter(name="Teacher").exists():
        event = Events.objects.filter(event_id=event_id, user=request.user).first()
        return render(request, 'dashboard/teachers/teacherEventView.html', { 'event':event })
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def teacher_dashboard_event_accept(request, event_id):
    if request.method == "POST":
        if request.user.groups.filter(name="Teacher").exists():
            event = Events.objects.filter(event_id=event_id, user=request.user).first()
        if not event:
            return HttpResponse("""
                                <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Event Not Found</h3>
                                </div>
                                """)
        elif event.event_status == "REJECTED" :
            return HttpResponse("""
                                <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Events that have been rejected can not be accepted afterword.</h3>
                                </div>
                                """)
        else:
            if event.event_status == "ACCEPTED":
                return HttpResponse("""
                                <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Event Already Accepted</h3>
                                </div>
                                """)
            event.event_status = "ACCEPTED"
            event.save()
            return HttpResponse("""
                                <div class="bg-green-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Event Accepted</h3>
                                </div>
                                """)
    return redirect('dashboard:dashboard')

@login_required(login_url='users:login')
def teacher_dashboard_event_reject(request, event_id):
    if request.method == "POST":
        if request.user.groups.filter(name="Teacher").exists():
            event = Events.objects.filter(event_id=event_id, user=request.user).first()
        if not event:
            return HttpResponse("""
                                <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Event Not Found</h3>
                                </div>
                                """)
        elif event.event_status == "ACCEPTED" :
            return HttpResponse("""
                                <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Events that have been accepted can not be rejected afterword.</h3>
                                </div>
                                """)

        else:
            if event.event_status == "REJECTED":
                return HttpResponse("""
                                <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Event Already Rejected</h3>
                                </div>
                                """)
            event.event_status = "REJECTED"
            event.save()
            return HttpResponse("""
                                <div class="bg-red-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Event Rejected</h3>
                                </div>
                                """)
    return redirect('dashboard:dashboard')

####################################USER SECTION####################################



@login_required(login_url='users:login')
def student_dashboard(request):
    upcoming_event = None

    return render(request, 'dashboard/students/studentDashboard.html', { 'upcoming_event': upcoming_event})

@login_required(login_url='users:login')
def student_dashboard_settings(request):
    tickets = None

    return render(request, 'dashboard/students/studentSettings.html')

@login_required(login_url='users:login')
def student_dashboard_tickets(request):
    tickets = Tickets.objects.filter(user=request.user)
        

    return render(request, 'dashboard/students/tickets.html', {
        'tickets': tickets,
    })




