from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout

# Create your views here.
def register(request):
    form = UserCreationForm()
    return render(request, "users/register.html")

def login(request):
    # return redirect('/')
    return render(request, 'users/login.html')


# a view for logging out
def logout(request):
    logout(request) 
    return redirect('/')