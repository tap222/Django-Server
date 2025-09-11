from django import forms
from servers import models
from servers.models import Servers, Server_Applications


class CreateServerApplication(forms.ModelForm):
    class Meta:
        model = models.Server_Applications
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

    def clean_server_id(self):
        value = self.cleaned_data['server_id']
        digit_count = len(str(value))

        if digit_count< 18 or digit_count > 20:
            raise forms.ValidationError("Server ID must be between 18 and 20 digits.")

        server = Servers.objects.filter(server_id=value)
        server_application = Server_Applications.objects.filter(server_id=value)

        if server or server_application:
            raise forms.ValidationError("This server already signed with us.")

            
        
        return value

