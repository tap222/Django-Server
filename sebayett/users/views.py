from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm

# Create your views here.
def register(request):
    form = UserCreationForm()
    return render(request, "users/register.html")

def login(request):
    return redirect('/')


# a view for logging out
def logout(request):
    return redirect('/')