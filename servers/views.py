from django.shortcuts import render, redirect

from django.contrib.auth.decorators import login_required
from servers import forms, models
# Create your views here.

@login_required(login_url='users:login')
def server_apply(request):
    if request.method == 'POST':
        form = forms.CreateServerApplication(request.POST)
        if form.is_valid():
            # save data
            server_application = form.save(commit=False)
            server_application.user = request.user
            server_application.save()

            return redirect('/')

    else: 
        form = forms.CreateServerApplication()
    return render(request, 'servers/serverApply.html', { 'form': form })