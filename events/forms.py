from django import forms
from django.db import models
import datetime
from servers.models import Servers
from events.models import Events
from lessons.models import Lessons, Teacher_Availability

HOUR_BLOCKS = [
    (f"{hour}", f"{hour % 12 if hour % 12 != 0 else 12} to {(hour + 1) % 12 if (hour + 1) % 12 != 0 else 12} {'AM' if hour < 12 else 'PM'}")
    for hour in range(24)
]


class Create_Event(forms.Form):
    event_title = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': 'form-control'
        })
    )
    event_description = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control'
        })
    )
    event_date = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
            'min': datetime.date.today(),
        })
    )
    event_time = forms.ChoiceField(
        choices=HOUR_BLOCKS,
        label="Select a Time Block",
        widget=forms.Select(attrs={
            'class': 'form-select',
            'palceholder': 'Choose a time block'
            })
    )
    event_banner = forms.ImageField(
        widget=forms.ClearableFileInput(attrs={
            'class': 'w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500'
        })
    )

        

    def clean(self):
        cleaned_data = super().clean()
        if not self.lesson:
            raise ValueError("A lesson must be supplied.")

        lesson = self.lesson
        availability = Teacher_Availability.objects.filter(lesson=lesson)

        event_date = cleaned_data.get('event_date')
        event_time = cleaned_data.get('event_time')

        weekday = event_date.strftime('%A').lower()

        if not availability.filter(day=weekday).exists():
            self.add_error('event_date', 'The choosen date is not available for this lesson.')
        else:
            time_event = datetime.time(hour=int(event_time), minute=0)
            if time_event < availability.filter(day=weekday).first().start_time or time_event >= availability.filter(day=weekday).first().end_time:
                self.add_error('event_time', 'The choosen time is not available for this lesson.')
    
    def save(self):
        cleaned_data = super().clean()
        lesson = self.lesson
        user = self.user

        event_title = cleaned_data.get('event_title')
        event_description = cleaned_data.get('event_description')
        event_date = cleaned_data.get('event_date')
        event_time = cleaned_data.get('event_time')
        event_banner = cleaned_data.get('event_banner')

        Events.objects.create(
            user=user,
            server=Servers.objects.filter(user=user).first(),
            lesson=lesson,
            event_title=event_title,
            event_description=event_description,
            event_date=event_date,
            event_time=datetime.time(hour=int(event_time), minute=0),
            event_banner=event_banner,
        )

        

            

        
        



        