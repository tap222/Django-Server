from django.shortcuts import render, redirect

from django.contrib.auth.decorators import login_required
from teachers import forms, models
# Create your views here.

@login_required(login_url='users:login')
def teacher_apply(request):
    if request.method == 'POST':
        form = forms.CreateTeacherApplication(request.POST)
        if form.is_valid():
            # save data
            teacher_application = form.save(commit=False)
            teacher_application.user = request.user
            teacher_application.save()

            return redirect('base:home')
    else:
        form = forms.CreateTeacherApplication()
    return render(request, 'teachers/teacherApply.html', {'form': form})