from django.contrib import admin
from lessons.models import Lessons, Teacher_Availability

# Register your models here.

admin.site.register(Lessons)
admin.site.register(Teacher_Availability)