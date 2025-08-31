from django.shortcuts import render, redirect

from django.contrib.auth.decorators import login_required
from . import forms, models

# Create your views here.

@login_required(login_url='users:login')
def server_apply(request):
    if request.method == 'POST':
        form = forms.CreateApplication(request.POST)
        if form.is_valid():
            return redirect('/')

    else: 
        form = forms.CreateApplication()
    return render(request, 'servers/serverApply.html', { 'form': form })