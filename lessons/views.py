from django.shortcuts import render, redirect
from lessons.models import Lessons, Teacher_Availability
from django.contrib.auth.decorators import login_required

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
        hour_range = range(0, 24)
        return render(request, 'lessons/bookLesson.html', { 
            'lesson': lesson,
            'availability': availability,
            'range': hour_range,
        })
    return redirect('base:home')

