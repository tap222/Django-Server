<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import {
  endOnOrAfterStart,
  firstError,
  isoDate,
  maxLength,
  minTrimmedLength,
  trimmedRequired,
} from '@/utils/formValidation'

definePageMeta({ allowedRoles: ['teacher'] })

const form = ref({
  title: '',
  startDate: '',
  endDate: '',
})

const errors = reactive({
  title: '',
  startDate: '',
  endDate: '',
})

function clearErrors() {
  errors.title = ''
  errors.startDate = ''
  errors.endDate = ''
}

function validate(): boolean {
  clearErrors()
  errors.title = firstError(form.value.title, [
    trimmedRequired(),
    minTrimmedLength(2),
    maxLength(200),
  ]) ?? ''
  errors.startDate = firstError(form.value.startDate, [trimmedRequired(), isoDate()]) ?? ''
  errors.endDate = firstError(form.value.endDate, [
    trimmedRequired(),
    isoDate(),
    ...(form.value.startDate.trim() ? [endOnOrAfterStart(form.value.startDate)] : []),
  ]) ?? ''

  const order = ['vacation-create-title', 'vacation-create-start', 'vacation-create-end'] as const
  const keys: (keyof typeof errors)[] = ['title', 'startDate', 'endDate']
  for (let i = 0; i < keys.length; i++) {
    if (errors[keys[i]!]) {
      nextTick(() => document.getElementById(order[i]!)?.focus())
      break
    }
  }

  return !errors.title && !errors.startDate && !errors.endDate
}

function handleCreate() {
  if (!validate()) return
  console.log('Create vacation:', form.value)
  navigateTo('/teacher/vacations')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-[30px] font-bold leading-tight text-gray-900">Create Vacations</h1>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2 text-sm font-medium text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
        @click="navigateTo('/teacher/vacations')"
      >
        Back
      </button>
    </div>

    <div class="rounded-2xl bg-white p-8 shadow-sm">
      <form class="space-y-6" novalidate @submit.prevent="handleCreate">
        <div class="space-y-2">
          <label for="vacation-create-title" class="mb-2 block text-sm font-bold text-gray-900">Vacations Title:</label>
          <input
            id="vacation-create-title"
            v-model="form.title"
            type="text"
            placeholder="Enter a title for your vacations"
            class="w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1"
            :class="errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'"
            :aria-invalid="errors.title ? true : undefined"
            :aria-describedby="errors.title ? 'vacation-create-title-error' : undefined"
          >
          <p
            v-if="errors.title"
            id="vacation-create-title-error"
            role="alert"
            class="max-w-full break-words text-sm text-red-600"
          >
            {{ errors.title }}
          </p>
        </div>

        <DateRangePicker
          v-model:start="form.startDate"
          v-model:end="form.endDate"
          start-id="vacation-create-start"
          end-id="vacation-create-end"
          :error-start="errors.startDate"
          :error-end="errors.endDate"
        />

        <div class="flex justify-center pt-4">
          <button
            type="submit"
            class="min-w-[120px] rounded-lg bg-[#F76B00] px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#E55A00]"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
