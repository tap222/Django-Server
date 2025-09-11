from django import forms
from teachers import models


class CreateTeacherApplication(forms.ModelForm):
    GENDERS = {
        "": "Select Gender",
        "F": "Female",
        "M": "Male",
        "O": "Other",
    }
    gender = forms.ChoiceField(
        choices=GENDERS,
        widget=forms.Select(attrs={
            'class': "form-select",
            'placeholder': "Choose a gender",
            'aria-label': "Default select example"
        })
    )
    class Meta:
        model = models.Teacher_Applications
        fields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'expertise']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': "w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
                'placeholder': "Enter your first name"
            }),
            'last_name': forms.TextInput(attrs={
                'class': "w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
                'placeholder': "Enter your last name"
            }),
            'date_of_birth': forms.DateInput(attrs={
                'class': "w-full p-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none",
                'placeholder': "Enter your date of birth",
                'type': 'date',
            }),
            'expertise': forms.Textarea(attrs={
                'class': "w-full h-32 p-2 pr-10 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none",
                'placeholder': "Tell us about the your skill and expertise"
            }),
        }