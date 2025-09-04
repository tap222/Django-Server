from django.shortcuts import render, redirect

from django.contrib.auth.decorators import login_required
from teachers import forms, models
# Create your views here.

def teacher_apply(request):
    form = forms.CreateTeacherApplication()
    return render(request, 'teachers/teacherApply.html', {'form': form})