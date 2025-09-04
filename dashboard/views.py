from django.shortcuts import render, redirect
from servers.models import Server_Application
from django.contrib.auth.decorators import login_required

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
    # print('admin' in request.user.groups.all())
    
    return redirect('/')







@login_required(login_url='users:login')
def admin_dashboard(request):
    if request.user.groups.filter(name='Admin').exists():
        server_applications_count = Server_Application.objects.count()

        return render(request, 'dashboard/adminDashboard.html', {'server_applications_count': server_applications_count})
    return redirect('/')
        

@login_required(login_url='users:login')
def student_dashboard(request):
    # if request.user.groups.filter(name='Student').exists():
    return render(request, 'dashboard/userDashboard.html')


@login_required(login_url='users:login')
def server_dashboard(request):
    if request.user.groups.filter(name='Server').exists():
        return render(request, 'dashboard/serverDashboard.html')
    return redirect('/')


@login_required(login_url='users:login')
def teacher_dashboard(request):
    if request.user.groups.filter(name="Teacher)").exists():
        return render(request, 'dashboard/teacherDashboard.html')
    return redirect('/')