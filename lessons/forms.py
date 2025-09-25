from django import forms
from lessons import models
import datetime



DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]




class CreateLesson(forms.Form):
    CATEGORIES = [
        ('', 'Select a category'),
        ('history', 'History'),
        ('psychology', 'Psychology'),
        ('computer science', 'Computer Science'),
        ('math', 'Math'),
        ('physics', 'Physics'),
    ]


    lesson_title = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': "w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
            'placeholder': "Enter a title for you lesson"
        })
        )
    lesson_category = forms.ChoiceField(
        choices=CATEGORIES,
        widget=forms.Select(attrs={
            'class': "form-select",
            'placeholder': "Choose a category",
            'aria-label': "Default select example"
        })
        )
    lesson_description = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': "w-full h-32 p-2 pr-10 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none",
            'placeholder': "Tell us about the your lesson"
            })
        )
    banner = forms.ImageField(
        widget=forms.ClearableFileInput(attrs={
            'class': "w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
        })
    )
    # repeating = forms.BooleanField(
    #     required=False,
    #     widget=forms.CheckboxInput(attrs={
    #             'class': "form-checkbox w-full text-blue-600 h-5 w-5 ",
    #         })
    # )
    start_date = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': "w-full p-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none",
            'type': "date",
            'min': datetime.date.today()
        })
    )
    end_date = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': "w-full p-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none",
            'type': "date",
            'min': datetime.date.today()
        })
    )


    
    def __init__(self, *args, **kwargs):
        self.teacher_id = kwargs.pop('teacher_id', None)
        super().__init__(*args, **kwargs)

        for day_code, day_name in DAYS_OF_WEEK:
            self.fields[f'{day_code}_check'] = forms.BooleanField(
                required=False
            )
            self.fields[f'{day_code}_start'] = forms.TimeField(
                required=False,
                label=f'{day_name} Start',
                widget=forms.TimeInput(format='%H:%M', attrs={'type': 'time'})
            )
            self.fields[f'{day_code}_end'] = forms.TimeField(
                required=False,
                label=f'{day_name} End',
                widget=forms.TimeInput(format='%H:%M', attrs={'type': 'time'})
            )

    


    def clean(self):
        cleaned_data = super().clean()

        start_date = cleaned_data['start_date']
        end_date = cleaned_data['end_date']

        if not start_date:
            self.add_error(start_date, "Start date must be choosen")
            # raise forms.ValidationError("Start date must be choosen")
        if not end_date:
            self.add_error(end_date, "End date must be choosen")
            # raise forms.ValidationError("End date must be choosen")

        if start_date < datetime.date.today():
            self.add_error(start_date, "Start date can not come before today.")
            # raise forms.ValidationError("Start date can not come before today.")
        if start_date >= end_date:
            self.add_error(start_date, "Start date can not come after end date.")
            # raise forms.ValidationError("Start date can not come after end date.")
        if end_date < datetime.date.today():
            self.add_error(end_date, "End date can not come before today.")
            # raise forms.ValidationError("End date can not come before today.")
        if end_date <= start_date:
            self.add_error(end_date, "End date can not come before start date.")
            # raise forms.ValidationError("End date can not come before start date.")

        flag = False

        for day_code, day_name in DAYS_OF_WEEK:
            check_field = f'{day_code}_check'
            start_field = f'{day_code}_start'    
            end_field = f'{day_code}_end'

            if cleaned_data.get(check_field):
                start_time = cleaned_data.get(start_field)
                end_time = cleaned_data.get(end_field)

            
                if not start_time:
                    self.add_error(start_field, f'{day_name} start time is required when {day_name} is selected.')
                if not end_time:
                    self.add_error(end_field, f'{day_name} end time is required when {day_name} is selected.')
                
                if start_time and end_time:
                    if end_time <= start_time:
                        self.add_error(end_field, f'{day_name} end time must be after start time.')

                flag = True
        
            else:
                if cleaned_data.get(start_field) or cleaned_data.get(end_field):
                    self.add_error(check_field, f'{day_name} must be selected to specify start and end times.')

                    return cleaned_data
        
        if not flag:
            raise forms.ValidationError("You must check atleast one week day to create a lesson.")

    def save(self):
        if not self.teacher:
            raise ValueError("Teacher ID must be provided to save the lesson.")

        teacher = self.teacher
        lesson_title = self.cleaned_data.get('lesson_title')
        lesson_category = self.cleaned_data.get('lesson_category')
        lesson_description = self.cleaned_data.get('lesson_description')
        banner = self.cleaned_data.get('banner')
        start_date = self.cleaned_data.get('start_date')
        end_date = self.cleaned_data.get('end_date')


        models.Lessons.objects.create(
            user=teacher.user,
            teacher=teacher,
            lesson_title=lesson_title,
            lesson_category=lesson_category,
            lesson_description=lesson_description,
            banner=banner,
            start_date=start_date,
            end_date=end_date
        )


        for day_code, _ in DAYS_OF_WEEK:
            check_field = self.cleaned_data.get(f'{day_code}_check')
            if check_field:
                start_time = self.cleaned_data.get(f'{day_code}_start')
                end_time = self.cleaned_data.get(f'{day_code}_end')
                
                lesson = models.Lessons.objects.filter(teacher=teacher).first()
                if not lesson:
                    raise ValueError("The lesson does not exists.")

                models.Teacher_Availability.objects.create(
                    teacher=teacher,
                    lesson=lesson,
                    day=day_code,
                    start_time=start_time,
                    end_time=end_time
                )

        



# class AvailabilityForm(forms.Form):
#     def __init__(self, *args, **kwargs):
#         self.teacher_id = kwargs.pop('teacher_id', None)
#         super().__init__(*args, **kwargs)

#         for day_code, day_name in DAYS_OF_WEEK:
#             self.fields[f'{day_code}_check'] = forms.BooleanField(
#                 required=False
#             )
#             self.fields[f'{day_code}_start'] = forms.TimeField(
#                 required=False,
#                 label=f'{day_name} Start',
#                 widget=forms.TimeInput(format='%H:%M', attrs={'type': 'time'})
#             )
#             self.fields[f'{day_code}_end'] = forms.TimeField(
#                 required=False,
#                 label=f'{day_name} End',
#                 widget=forms.TimeInput(format='%H:%M', attrs={'type': 'time'})
#             )

#     def clean(self):
#         cleaned_data = super().clean()
#         for day_code, day_name in DAYS_OF_WEEK:
#             check_field = f'{day_code}_check'
#             start_field = f'{day_code}_start'    
#             end_field = f'{day_code}_end'

#         if cleaned_data.get(check_field):
#             start_time = cleaned_data.get(start_field)
#             end_time = cleaned_data.get(end_field)

        
#             if not start_time:
#                 self.add_error(start_field, f'{day_name} start time is required when {day_name} is selected.')
#             if not end_time:
#                 self.add_error(end_field, f'{day_name} end time is required when {day_name} is selected.')
            
#             if start_time and end_time:
#                 if end_time <= start_time:
#                     self.add_error(nd_field, f'{day_name} end time must be after start time.')
#         else:
#             if cleaned_data.get(start_field) or cleaned_data.get(end_field):
#                 self.add_error(check_field, f'{day_name} must be selected to specify start and end times.')

#                 return cleaned_data
        
#         def save(self):
#             if not self.teacher_id:
#                 raise ValueError("Teacher ID must be provided to save availability.")

#             for day_code, _ in DAYS_OF_WEEK:
#                 check_field = self.cleaned_data.get(f'{day_code}_check')
#                 if check_field:
#                     start_time = self.cleaned_data.get(f'{day_code}_start')
#                     end_time = self.cleaned_data.get(f'{day_code}_end')

#                     Availability.objects.create(
#                         teacher_id=teacher_id,
#                         day=day_code,
#                         start_time=start_time,
#                         end_time=end_time
#                     )
#                     availability.save()
            



