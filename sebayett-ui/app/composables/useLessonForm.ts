import { nextTick, onMounted, reactive, ref } from 'vue'
import { parseIsoDate } from '@/components/common/datePickerCalendar'
import { lessonService } from '@/services/lessonService'
import {
  endOnOrAfterStart,
  firstError,
  imageFileSelected,
  isoDate,
  maxLength,
  minTrimmedLength,
  trimmedRequired,
} from '@/utils/formValidation'

export interface ScheduleItem {
  day: string
  enabled: boolean
  startTime: string
  endTime: string
}

export interface CreateLessonForm {
  title: string
  category: string
  description: string
  startDate: string
  endDate: string
  banner: File | null
  schedule: ScheduleItem[]
}

export interface FormErrors {
  title?: string
  category?: string
  description?: string
  startDate?: string
  endDate?: string
  banner?: string
  schedule?: string
}

export function useLessonForm(lessonId?: string) {
  const isSubmitting = ref(false)
  const isLoading = ref(false)
  const isEditMode = ref(!!lessonId)
  const errors = reactive<FormErrors>({})

  const form = reactive<CreateLessonForm>({
    title: '',
    category: '',
    description: '',
    startDate: '',
    endDate: '',
    banner: null,
    schedule: [
      { day: 'Monday', enabled: false, startTime: '', endTime: '' },
      { day: 'Tuesday', enabled: false, startTime: '', endTime: '' },
      { day: 'Wednesday', enabled: false, startTime: '', endTime: '' },
      { day: 'Thursday', enabled: false, startTime: '', endTime: '' },
      { day: 'Friday', enabled: false, startTime: '', endTime: '' },
      { day: 'Saturday', enabled: false, startTime: '', endTime: '' },
      { day: 'Sunday', enabled: false, startTime: '', endTime: '' },
    ],
  })

  async function loadLessonData() {
    if (!lessonId) return

    isLoading.value = true
    try {
      const lesson = await lessonService.getLessonById(parseInt(lessonId))
      if (lesson) {
        // Populate form with existing lesson data
        form.title = lesson.title
        form.category = lesson.category
        // For demo purposes, set some default values for fields not in LessonDetail
        form.description = 'This is a sample lesson description'
        form.startDate = new Date().toISOString().split('T')[0] || ''
        form.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || ''

        // For now, keep default schedule - in a real app, you'd load this from the lesson data
        // form.schedule = lesson.schedule || form.schedule
      }
    } catch (error) {
      console.error('Failed to load lesson data:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    if (lessonId) {
      loadLessonData()
    }
  })

  function clearAllErrors() {
    Object.keys(errors).forEach((key) => {
      delete errors[key as keyof FormErrors]
    })
  }

  function validateForm(fieldIds: {
    title: string
    category: string
    description: string
    start: string
    end: string
    banner: string
    schedule: string
  }): boolean {
    clearAllErrors()

    errors.title = firstError(form.title, [
      trimmedRequired('Lesson title is required.'),
      minTrimmedLength(3, 'Lesson title must be at least 3 characters.'),
      maxLength(200),
    ]) ?? ''

    errors.category = firstError(form.category, [
      trimmedRequired('Please select a category.'),
    ]) ?? ''

    errors.description = firstError(form.description, [
      trimmedRequired('Lesson description is required.'),
      minTrimmedLength(10, 'Description must be at least 10 characters.'),
      maxLength(5000),
    ]) ?? ''

    errors.startDate = firstError(form.startDate, [
      trimmedRequired('Start date is required.'),
      isoDate('Choose a valid start date.'),
    ]) ?? ''

    const endRules = [
      trimmedRequired('End date is required.'),
      isoDate('Choose a valid end date.'),
    ] as const
    if (form.startDate.trim() && parseIsoDate(form.startDate.trim())) {
      errors.endDate = firstError(form.endDate, [
        ...endRules,
        endOnOrAfterStart(form.startDate.trim(), 'End date must be on or after the start date.'),
      ]) ?? ''
    }
    else {
      errors.endDate = firstError(form.endDate, [...endRules]) ?? ''
    }

    if (form.banner) {
      errors.banner = imageFileSelected(5 * 1024 * 1024)(form.banner) ?? ''
    }

    const hasSchedule = form.schedule.some(item => item.enabled)
    if (!hasSchedule) {
      errors.schedule = 'Please select at least one day for the schedule'
    }

    if (!errors.schedule) {
      for (const item of form.schedule) {
        if (!item.enabled) continue
        if (!item.startTime?.trim()) {
          errors.schedule = `Start time is required for ${item.day}`
          break
        }
        if (!item.endTime?.trim()) {
          errors.schedule = `End time is required for ${item.day}`
          break
        }
        if (item.startTime && item.endTime && item.endTime <= item.startTime) {
          errors.schedule = `End time must be after start time for ${item.day}`
          break
        }
      }
    }

    const order = [
      fieldIds.title,
      fieldIds.category,
      fieldIds.description,
      fieldIds.start,
      fieldIds.end,
      fieldIds.banner,
      fieldIds.schedule,
    ]
    const keys: (keyof FormErrors)[] = [
      'title',
      'category',
      'description',
      'startDate',
      'endDate',
      'banner',
      'schedule',
    ]
    for (let i = 0; i < keys.length; i++) {
      if (errors[keys[i]!]) {
        nextTick(() => {
          const el = document.getElementById(order[i]!)
          el?.focus()
          el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        })
        break
      }
    }

    return !Object.values(errors).some(Boolean)
  }

  function resetForm() {
    form.title = ''
    form.category = ''
    form.description = ''
    form.startDate = ''
    form.endDate = ''
    form.banner = null
    form.schedule = form.schedule.map(item => ({
      ...item,
      enabled: false,
      startTime: '',
      endTime: '',
    }))

    // Clear errors
    Object.keys(errors).forEach((key) => {
      delete errors[key as keyof FormErrors]
    })
  }

  async function handleSubmit(fieldIds: {
    title: string
    category: string
    description: string
    start: string
    end: string
    banner: string
    schedule: string
  }) {
    if (!validateForm(fieldIds)) {
      return
    }

    isSubmitting.value = true

    try {
      // Prepare data for API
      const lessonData = {
        title: form.title,
        category: form.category,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        schedule: form.schedule.filter(item => item.enabled),
        banner: form.banner,
      }

      if (isEditMode.value && lessonId) {
        // Update existing lesson
        await lessonService.updateLesson(parseInt(lessonId), lessonData)
      } else {
        // Create new lesson
        await lessonService.createLesson(lessonData)
      }

      // Reset form on success (only for create mode)
      if (!isEditMode.value) {
        resetForm()
      }

      // Navigate back to lessons list
      navigateTo('/teacher/lessons')
    } catch (error) {
      console.error('Failed to save lesson:', error)
      // Handle error (could show toast notification)
    } finally {
      isSubmitting.value = false
    }
  }

  function updateSchedule(newSchedule: ScheduleItem[]) {
    form.schedule = newSchedule
  }

  function handleBannerChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      form.banner = target.files[0]
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    isLoading,
    isEditMode,
    handleSubmit,
    resetForm,
    updateSchedule,
    handleBannerChange,
  }
}
