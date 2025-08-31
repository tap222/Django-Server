from django import forms
from . import models

class CreateApplication(forms.ModelForm):
    class Meta:
        model = models.Server_Application
        fields = ['first_name', 'last_name', 'server_id', 'server_name', 'server_description', 'server_interests']

