<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import LessonBookingDateTimeFields from '~/components/public/lessons/LessonBookingDateTimeFields.vue'
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'
import PublicSelectDropdown from '~/components/public/ui/PublicSelectDropdown.vue'
import {
  firstError,
  imageFileSelected,
  isoDate,
  maxLength,
  minTrimmedLength,
  timePickerValue,
  trimmedRequired,
} from '~/utils/formValidation'

const controlClass =
  'h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/40'

const controlClassInvalid =
  'h-11 w-full rounded-lg border border-red-500 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/30'

const form = reactive({
  eventTitle: '',
  eventDescription: '',
  /** Selected calendar date (yyyy-mm-dd). */
  date: '',
  time: '',
  server: "Kajal's Server",
})

const fileLabel = ref('No file chosen')
const selectedFile = ref<File | null>(null)

const serverOptions = ["Kajal's Server", 'Community Demo Server']

const errors = reactive({
  eventTitle: '',
  eventDescription: '',
  date: '',
  time: '',
  server: '',
  banner: '',
})

function clearErrors() {
  errors.eventTitle = ''
  errors.eventDescription = ''
  errors.date = ''
  errors.time = ''
  errors.server = ''
  errors.banner = ''
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  selectedFile.value = file ?? null
  fileLabel.value = file ? file.name : 'No file chosen'
  errors.banner = ''
}

function validate(): boolean {
  clearErrors()
  errors.eventTitle = firstError(form.eventTitle, [
    trimmedRequired(),
    minTrimmedLength(2),
    maxLength(120),
  ]) ?? ''
  errors.eventDescription = firstError(form.eventDescription, [
    trimmedRequired(),
    minTrimmedLength(2),
    maxLength(2000),
  ]) ?? ''
  errors.date = firstError(form.date, [trimmedRequired(), isoDate()]) ?? ''
  errors.time = firstError(form.time, [trimmedRequired(), timePickerValue(true)]) ?? ''
  errors.server = firstError(form.server, [trimmedRequired()]) ?? ''
  if (selectedFile.value) {
    errors.banner = imageFileSelected(5 * 1024 * 1024)(selectedFile.value) ?? ''
  }

  const order = [
    'book-event-title',
    'book-event-description',
    'book-event-date',
    'book-event-time',
    'book-server',
    'book-event-banner',
  ] as const
  const keys: (keyof typeof errors)[] = [
    'eventTitle',
    'eventDescription',
    'date',
    'time',
    'server',
    'banner',
  ]
  for (let i = 0; i < keys.length; i++) {
    if (errors[keys[i]!]) {
      const id = order[i]!
      nextTick(() => document.getElementById(id)?.focus())
      break
    }
  }

  return !Object.values(errors).some(Boolean)
}

function onSubmit() {
  if (!validate()) return
  console.info('[Book Lesson]', { ...form, file: selectedFile.value?.name })
}
</script>

<template>
  <section
    class="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8"
    aria-labelledby="booking-form-heading"
  >
    <h2
      id="booking-form-heading"
      class="text-lg font-bold tracking-tight text-neutral-900"
    >
      Choose The Time and Date you want
    </h2>

    <form class="mt-6 grid gap-5" novalidate @submit.prevent="onSubmit">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-600" for="book-event-title">
          Event Title
        </label>
        <input
          id="book-event-title"
          v-model="form.eventTitle"
          type="text"
          :class="errors.eventTitle ? controlClassInvalid : controlClass"
          placeholder="Enter titel"
          autocomplete="off"
          :aria-invalid="errors.eventTitle ? true : undefined"
          :aria-describedby="errors.eventTitle ? 'book-event-title-error' : undefined"
        >
        <p
          v-if="errors.eventTitle"
          id="book-event-title-error"
          role="alert"
          class="max-w-full break-words text-xs text-red-600"
        >
          {{ errors.eventTitle }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="block text-sm font-medium text-neutral-600"
          for="book-event-description"
        >
          Event Description
        </label>
        <input
          id="book-event-description"
          v-model="form.eventDescription"
          type="text"
          :class="errors.eventDescription ? controlClassInvalid : controlClass"
          placeholder="Enter event discription"
          autocomplete="off"
          :aria-invalid="errors.eventDescription ? true : undefined"
          :aria-describedby="errors.eventDescription ? 'book-event-description-error' : undefined"
        >
        <p
          v-if="errors.eventDescription"
          id="book-event-description-error"
          role="alert"
          class="max-w-full break-words text-xs text-red-600"
        >
          {{ errors.eventDescription }}
        </p>
      </div>

      <LessonBookingDateTimeFields
        v-model:date="form.date"
        v-model:time="form.time"
        :date-error="errors.date"
        :time-error="errors.time"
      />

      <div class="space-y-2">
        <span class="block text-sm font-medium text-neutral-600" id="book-banner-label">
          Upload an Event Banner
        </span>
        <div
          class="flex min-h-[80px] flex-row flex-wrap items-center justify-center gap-3 rounded-lg border bg-white px-4 py-4"
          :class="errors.banner ? 'border-red-500' : 'border-neutral-200'"
          role="group"
          aria-labelledby="book-banner-label"
        >
          <label
            class="inline-flex cursor-pointer items-center gap-3"
            for="book-event-banner"
          >
            <span
              class="inline-flex h-9 shrink-0 items-center rounded-lg border border-neutral-300 bg-neutral-100 px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
            >
              Choose File
            </span>
            <input
              id="book-event-banner"
              type="file"
              class="sr-only"
              accept="image/*"
              :aria-invalid="errors.banner ? true : undefined"
              :aria-describedby="errors.banner ? 'book-event-banner-error' : undefined"
              @change="onFileChange"
            >
          </label>
          <span class="text-sm text-neutral-500">{{ fileLabel }}</span>
        </div>
        <p
          v-if="errors.banner"
          id="book-event-banner-error"
          role="alert"
          class="max-w-full break-words text-xs text-red-600"
        >
          {{ errors.banner }}
        </p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-600" for="book-server">
          Server
        </label>
        <PublicSelectDropdown
          v-model="form.server"
          :options="serverOptions"
          trigger-id="book-server"
          listbox-id="book-server-listbox"
          :error-message="errors.server"
        />
      </div>

      <div class="flex justify-center pt-3">
        <PrimaryButton
          type="submit"
          variant="primary"
          class="h-11 w-full rounded-xl px-8 hover:opacity-90 sm:w-auto"
        >
          Book Events
        </PrimaryButton>
      </div>
    </form>
  </section>
</template>
