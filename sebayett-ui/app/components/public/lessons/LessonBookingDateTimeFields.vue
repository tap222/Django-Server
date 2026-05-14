<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@/components/common/DatePicker.vue'
import TimePicker from '@/components/common/TimePicker.vue'

defineProps<{
  dateError?: string
  timeError?: string
}>()

const date = defineModel<string>('date', { default: '' })
const time = defineModel<string>('time', { default: '' })

const datePickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
const timePickerRef = ref<InstanceType<typeof TimePicker> | null>(null)

function onDateOpened() {
  timePickerRef.value?.closePanel()
}

function onTimeOpened() {
  datePickerRef.value?.closePanel()
}
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-600" for="book-event-date">
        Date
      </label>
      <DatePicker
        ref="datePickerRef"
        v-model="date"
        button-id="book-event-date"
        :invalid="!!dateError"
        :aria-describedby="dateError ? 'book-event-date-error' : undefined"
        @opened="onDateOpened"
      />
      <p
        v-if="dateError"
        id="book-event-date-error"
        role="alert"
        class="min-h-[1.25rem] max-w-full break-words text-xs text-red-600"
      >
        {{ dateError }}
      </p>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-600" for="book-event-time">
        Time
      </label>
      <TimePicker
        ref="timePickerRef"
        v-model="time"
        trigger-id="book-event-time"
        :invalid="!!timeError"
        :aria-describedby="timeError ? 'book-event-time-error' : undefined"
        @opened="onTimeOpened"
      />
      <p
        v-if="timeError"
        id="book-event-time-error"
        role="alert"
        class="min-h-[1.25rem] max-w-full break-words text-xs text-red-600"
      >
        {{ timeError }}
      </p>
    </div>
  </div>
</template>
