from django import forms
from django.db import transaction
from django.utils import timezone
from lessons import models
import datetime



DAYS_OF_WEEK = [
    ("monday", "Monday"),
    ("tuesday", "Tuesday"),
    ("wednesday", "Wednesday"),
    ("thursday", "Thursday"),
    ("friday", "Friday"),
    ("saturday", "Saturday"),
    ("sunday", "Sunday"),
]


class CreateLesson(forms.Form):
    """Form to create a Lessons instance and its Teacher_Availability rows.

    Improvements made:
    - validation does not return early inside the loop
    - clean() returns cleaned_data
    - save() is atomic, returns the created lesson instance
    """

    CATEGORIES = [
        ("", "Select a category"),
        ("history", "History"),
        ("psychology", "Psychology"),
        ("computer science", "Computer Science"),
        ("math", "Math"),
        ("physics", "Physics"),
    ]

    lesson_title = forms.CharField(
        max_length=200,
        widget=forms.TextInput(
            attrs={
                "class": "w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
                "placeholder": "Enter a title for your lesson",
            }
        ),
    )
    lesson_category = forms.ChoiceField(
        choices=CATEGORIES,
        widget=forms.Select(attrs={"class": "form-select", "aria-label": "Category select"}),
    )
    lesson_description = forms.CharField(
        widget=forms.Textarea(
            attrs={
                "class": "w-full h-32 p-2 pr-10 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none",
                "placeholder": "Tell us about your lesson",
            }
        )
    )
    banner = forms.ImageField(
        required=False,
        widget=forms.ClearableFileInput(
            attrs={
                "class": "w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500",
            }
        ),
    )

    start_date = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': "w-full p-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none",
            'type': "date",
            'min': datetime.date.today().isoformat()
        })
    )
    end_date = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': "w-full p-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none",
            'type': "date",
            'min': datetime.date.today().isoformat()
        })
    )
    # self.teacher_id = kwargs.pop('teacher_id', None)
    # self.teacher = None
    # if self.teacher_id is not None:
    #     try:
    #         self.teacher = models.Teacher.objects.get(id=self.teacher_id)
    #     except models.Teacher.DoesNotExist:
    #         self.teacher = None
    # super().__init__(*args, **kwargs)


    
    def __init__(self, *args, **kwargs):
        # teacher_id is expected to be a Teacher model instance (not just an id)
        self.teacher_id = kwargs.pop("teacher_id", None)
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

        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')

        # Basic presence checks
        if not start_date:
            self.add_error('start_date', "Start date must be choosen")
            # raise forms.ValidationError("Start date must be choosen")
        if not end_date:
            self.add_error("end_date", "End date must be chosen")

        # Only perform further comparisons if dates exist
        if start_date and start_date < timezone.now().date():
            self.add_error("start_date", "Start date cannot be in the past.")

        if end_date and end_date < timezone.now().date():
            self.add_error("end_date", "End date cannot be in the past.")

        if start_date and end_date and start_date >= end_date:
            self.add_error('start_date', "Start date can not come after or be the same as end date.")
        if end_date and end_date < datetime.date.today():
            self.add_error('end_date', "End date can not come before today.")

        any_day_selected = False

        for day_code, day_name in DAYS_OF_WEEK:
            check_field = f'{day_code}_check'
            start_field = f'{day_code}_start'    
            end_field = f'{day_code}_end'

            checked = cleaned_data.get(check_field)
            start_time = cleaned_data.get(start_field)
            end_time = cleaned_data.get(end_field)

            if checked:
                any_day_selected = True
                if not start_time:
                    self.add_error(start_field, f'{day_name} start time is required when {day_name} is selected.')
                if not end_time:
                    self.add_error(end_field, f"{day_name} end time is required when {day_name} is selected.")
                if start_time and end_time and end_time <= start_time:
                    self.add_error(end_field, f"{day_name} end time must be after start time.")
            else:
                # if times provided but checkbox not ticked, that's an error
                if start_time or end_time:
                    self.add_error(check_field, f"{day_name} must be selected to specify start and end times.")

        if not any_day_selected:
            raise forms.ValidationError("You must check at least one weekday to create a lesson.")

        return cleaned_data

    def save(self):
        """Create a Lessons instance and corresponding Teacher_Availability rows.

        Returns the created Lessons instance.
        """
        if not self.teacher_id:
            raise ValueError("Teacher ID (teacher instance) must be provided to save the lesson.")

        teacher = self.teacher_id
        # required fields should already be validated by clean()
        lesson_title = self.cleaned_data.get("lesson_title")
        lesson_category = self.cleaned_data.get("lesson_category")
        lesson_description = self.cleaned_data.get("lesson_description")
        banner = self.cleaned_data.get("banner")
        start_date = self.cleaned_data.get("start_date")
        end_date = self.cleaned_data.get("end_date")

        with transaction.atomic():
            lesson = models.Lessons.objects.create(
                user=getattr(teacher, "user", None),
                teacher=teacher,
                lesson_title=lesson_title,
                lesson_category=lesson_category,
                lesson_description=lesson_description,
                banner=banner,
                start_date=start_date,
                end_date=end_date,
            )

            for day_code, _ in DAYS_OF_WEEK:
                check_field = self.cleaned_data.get(f"{day_code}_check")
                if check_field:
                    start_time = self.cleaned_data.get(f"{day_code}_start")
                    end_time = self.cleaned_data.get(f"{day_code}_end")

                    models.Teacher_Availability.objects.create(
                        teacher=teacher,
                        lesson=lesson,
                        day=day_code,
                        start_time=start_time,
                        end_time=end_time,
                    )

        return lesson


# The commented AvailabilityForm was intentionally left out; recreate separately if needed.
            



