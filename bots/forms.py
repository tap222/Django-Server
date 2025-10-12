from django import forms
from servers import models
from bots.models import Bots


class AddBot(forms.ModelForm):
    class Meta:
        model = Bots
        fields = ['server', 'bot_id', 'bot_self_token']
        widgets = {
            # 'server': forms.TextInput(attrs={
            #     'class': 'w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500',
            #     'placeholder': "Enter your first name"
                
            # }),
            'bot_id': forms.TextInput(attrs={
                'class': 'w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500',
                'placeholder': "Enter the id of the bot "
            }),
            'bot_self_token': forms.TextInput(attrs={
                'class' : 'w-full p-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none',
                'placeholder': "Enter the self-bot token"
            })
        }
    
    def clean_bot_id(self):
        value = self.cleaned_data['bot_id']
        digit_count = len(str(value))

        if digit_count < 18 or digit_count > 20:
            raise forms.ValidationError("Server ID must be between 18 and 20 digits.")

        bot = Bots.objects.filter(server_id=value)

        if bot:
            raise forms.ValidationError("This server already signed with us.")
        
        return value

    def clean_bot_self_token(self):
        value = self.cleaned_data['bot_self_token']
        digit_count = len(str(value))

        if not(digit_count == 61 or digit_count == 72):
            raise forms.ValidationError("Self Token must be either 61 characters or 72 characters")

        bot = Bots.objects.filter(bot_self_token=value)
        if bot:
            raise forms.ValidationError("This Self Token is already in use.")

        return value