from django import forms
from . import models

class CreateApplication(forms.ModelForm):
    class Meta:
        model = models.Server_Application
        fields = ['first_name', 'last_name', 'server_name', 'server_id','server_interests', 'server_description']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500',
                'placeholder': "Enter your first name"
                
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500',
                'placeholder': "Enter your last name"
            }),
            'server_id': forms.TextInput(attrs={
                'class' : 'w-full p-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none',
                'placeholder': "Enter your server's ID"
            }),
            'server_name': forms.TextInput(attrs={
                'class': 'w-full p-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none',
                'placeholder': "Enter your server's name"
            }),
            
            'server_interests': forms.TextInput(attrs={
                'class': 'w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500',
                'placeholder': "Enter your server interests"
            }),
            'server_description': forms.Textarea(attrs={
                'class': 'w-full h-32 p-2 pr-10 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none',
                'placeholder': 'Write a short description about your server'

            })
        }

