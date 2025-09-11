from django.shortcuts import render, redirect
from django.http import HttpResponse
from servers.models import Server_Applications, Servers
from teachers.models import Teacher_Applications, Teachers
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group


# Create your views here.

@login_required(login_url='users:login')
def dashboard(request):
    user = request.user

    if request.user.groups.filter(name='Admin').exists():
        return redirect('dashboard:admin')
    elif request.user.groups.filter(name='Server').exists():
        return redirect('dashboard:server')
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
        server_application = Server_Applications.objects.get(server_id=server_id)
        
        return render(request, 'dashboard/admin/serverApplicationView.html', { 'application': server_application })
    return redirect('dashboard:dashboard')



@login_required(login_url='users:login')
def admin_dashboard_server_application_accept(request, server_id):
    if request.method == 'POST':
        if request.user.groups.filter(name='Admin').exists():
            server_application = Server_Applications.objects.get(server_id=server_id)

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
                
                user = request.user
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
        server_application = Server_Applications.objects.get(server_id=server_id)

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
        server = Servers.objects.get(server_id=server_id)
        if not server:
            return redirect('dashborad:admin_servers')
        return render(request, 'dashboard/admin/serverView.html', { 'server': server})
    return redirect('dashboard:dashboard')

    

@login_required(login_url='users:login')
def admin_dashboard_server_delete(request, server_id):
    if request.user.groups.filter(name='Admin').exists():
        server = Servers.objects.get(server_id=server_id)
        if not server:
            return HttpResponse("""
                                    <div class="bg-yellow-100 p-4 rounded shadow text-center">
                                        <h3 class="text-sm sm:text-lg font-semibold">Server Not Found</h3>
                                    </div>
                                """)
        else:
            # server.delete()
            return HttpResponse("""
                                <div class="bg-red-100 p-4 rounded shadow text-center">
                                    <h3 class="text-sm sm:text-lg font-semibold">Server Rejected</h3>
                                </div>
                                """)





@login_required(login_url='users:login')
def admin_dashboard_servers(request):
    if request.user.groups.filter(name='Admin').exists():
        servers = Servers.objects.all()
        
        return render(request, 'dashboard/admin/servers.html', { 'servers': servers})
    
    return redirect('dashboard:dashboard')


@login_required(login_url='users:login')
def admin_dashboard_teacher_application_view(request):
    if request.user.groups.filter(name='Admin').exists():
        teacher_applications = Teacher_Applications.objects.all()

        return render(request, 'dashboard/admin/teacherApplication.html', {
            'application': teacher_applications
        })
    return redirect('dashboard:dashboard')
        


@login_required(login_url='users:login')
def admin_dashboard_teachers(request):
    if request.user.groups.filter(name='Admin').exists():
        teachers = Teachers.objects.all()

        return render(request, 'dashboard/admin/teachers.html', {
            'teachers': teachers
        })
    
    return redirect('dashboard:dashboard')

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
    if request.user.groups.filter(name="Teacher)").exists():
        return render(request, 'dashboard/teachers/teacherDashboard.html')
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
    future_tickets = None
    past_tickets = None

    return render(request, 'dashboard/students/tickets.html', {
        'future_tickets': future_tickets,
        'past_tickets': past_tickets,
    })




