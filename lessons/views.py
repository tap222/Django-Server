from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from lessons.models import Lessons, Teacher_Availability
from events.forms import Create_Event
from teachers.models import Teachers


# Create your views here.


@login_required(login_url='users:login')
def lessons(request):
    if request.user.groups.filter(name='Server').exists():
        lessons = Lessons.objects.filter(is_active=True)

        return render(request, 'lessons/browseLessons.html', { 'lessons': lessons})
    
    return redirect('base:home')


@login_required(login_url='users:login')
def lesson_view(request, lesson_id):
    if request.user.groups.filter(name='Server').exists():
        lesson = Lessons.objects.filter(lesson_id=lesson_id).first()
        availability = Teacher_Availability.objects.filter(lesson=lesson)
        return render(request, 'lessons/lessonDetails.html', { 
            'lesson': lesson,
            'availability': availability
        })
    return redirect('base:home')


@login_required(login_url='users:login')
def lesson_book(request, lesson_id):
    if request.user.groups.filter(name='Server').exists():
        lesson = Lessons.objects.filter(lesson_id=lesson_id).first()
        availability = Teacher_Availability.objects.filter(lesson=lesson)
        if request.method == 'POST':
            form = Create_Event(request.POST, request.FILES, user=request.user, lesson=lesson)
            if form.is_valid():
                form.save()
                return redirect('base:home')
        else:
            form = Create_Event(user=request.user)
        return render(request, 'lessons/bookLesson.html', { 
            'lesson': lesson,
            'availability': availability,
            'form': form,
        })
    return redirect('base:home')

