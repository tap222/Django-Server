from django.shortcuts import render, redirect
from lessons.models import Lessons
from django.contrib.auth.decorators import login_required

# Create your views here.


@login_required(login_url='users:login')
def lessons(request):
    if request.user.groups.filter(name='Server').exists():
        lessons = Lessons.objects.all()

        return render(request, 'lessons/browseLessons.html', { 'lessons': lessons})
    
    return redirect('base:home')


@login_required(login_url='users:login')
def lesson_view(request):
    if request.user.groups.filter(name='Server').exists():
        return redirect('base:home')
    return redirect('base:home')
