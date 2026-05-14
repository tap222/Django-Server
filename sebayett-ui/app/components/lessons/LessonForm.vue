<script setup lang="ts">
import { computed, useId } from 'vue'
import { useLessonForm } from '@/composables/useLessonForm'
import FormInput from '@/components/common/FormInput.vue'
import { Dropdown } from '@/components/ui/dropdown'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import LessonScheduleTable from './LessonScheduleTable.vue'

interface Props {
  lessonId?: string
  isEditMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
})

const uid = useId().replace(/:/g, '')
function fieldId(suffix: string) {
  return `lesson-form-${uid}-${suffix}`
}

const ids = {
  title: fieldId('title'),
  category: fieldId('category'),
  listbox: fieldId('category-listbox'),
  description: fieldId('description'),
  descriptionError: fieldId('description-error'),
  start: fieldId('start-date'),
  end: fieldId('end-date'),
  banner: fieldId('banner'),
  bannerError: fieldId('banner-error'),
  schedule: fieldId('schedule-shell'),
}

const {
  form,
  errors,
  isSubmitting,
  isLoading,
  isEditMode: isEditModeFromComposable,
  handleSubmit,
  updateSchedule,
  handleBannerChange,
} = useLessonForm(props.lessonId)

const categories = [
  'History',
  'Psychology',
  'Computer Science',
  'Math',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'Art',
  'Music',
]

function onBannerInput(e: Event) {
  handleBannerChange(e)
  if (errors.banner) delete errors.banner
}

const textareaClass = computed(() => {
  const base =
    'w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-300 focus:ring-2'
  if (errors.description) {
    return `${base} border-red-500 focus:border-red-500 focus:ring-red-500/30`
  }
  return `${base} border-gray-200 focus:border-orange-400 focus:ring-orange-400/30`
})

const bannerZoneClass = computed(() => {
  const base =
    'flex h-[120px] items-center justify-center rounded-lg border border-dashed bg-white'
  if (errors.banner) {
    return `${base} border-red-500`
  }
  return `${base} border-gray-200`
})
</script>

<template>
  <form novalidate class="space-y-8" @submit.prevent="handleSubmit(ids)">
    <!-- First Row: Lesson Title and Category -->
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <FormInput
        :input-id="ids.title"
        v-model="form.title"
        label="Lesson title:"
        placeholder="Enter a title for your lesson"
        :error-message="errors.title ?? ''"
      />

      <div class="space-y-2">
        <label class="block text-[15px] font-semibold text-gray-900" :for="ids.category">Lesson category:</label>
        <Dropdown
          :button-id="ids.category"
          :listbox-id="ids.listbox"
          :model-value="form.category"
          :options="['', ...categories]"
          placeholder="Select a category"
          width-class="w-full"
          :error-message="errors.category ?? ''"
          @update:model-value="form.category = $event"
        />
      </div>
    </div>

    <!-- Lesson Description (Full Width) -->
    <div class="space-y-2">
      <label class="block text-[15px] font-semibold text-gray-900" :for="ids.description">Lesson description:</label>
      <textarea
        :id="ids.description"
        v-model="form.description"
        rows="5"
        :class="textareaClass"
        placeholder="Enter a description for your lesson"
        :aria-invalid="errors.description ? true : undefined"
        :aria-describedby="errors.description ? ids.descriptionError : undefined"
      />
      <p
        v-if="errors.description"
        :id="ids.descriptionError"
        role="alert"
        class="max-w-full break-words text-sm text-red-600"
      >
        {{ errors.description }}
      </p>
    </div>

    <!-- Second Row: Start Date and End Date -->
    <div class="space-y-2">
      <DateRangePicker
        v-model:start="form.startDate"
        v-model:end="form.endDate"
        start-label="Start date:"
        end-label="End date:"
        :start-id="ids.start"
        :end-id="ids.end"
        :error-start="errors.startDate ?? ''"
        :error-end="errors.endDate ?? ''"
      />
    </div>

    <!-- Banner Upload -->
    <div class="space-y-2">
      <span class="block text-[15px] font-semibold text-gray-900" :id="`${ids.banner}-label`">Banner:</span>
      <div
        :class="bannerZoneClass"
        role="group"
        :aria-labelledby="`${ids.banner}-label`"
      >
        <div class="flex items-center gap-4">
          <input
            :id="ids.banner"
            type="file"
            accept="image/*"
            class="sr-only"
            :aria-invalid="errors.banner ? true : undefined"
            :aria-describedby="errors.banner ? ids.bannerError : undefined"
            @change="onBannerInput"
          >
          <label
            :for="ids.banner"
            class="cursor-pointer rounded-lg bg-[#F0F0F0] px-6 py-2 text-[13px] font-semibold text-[#6E6E6E] transition-colors hover:bg-gray-200"
          >
            Choose File
          </label>
          <span class="text-sm text-gray-400">
            {{ form.banner ? form.banner.name : 'No file chosen' }}
          </span>
        </div>
      </div>
      <p
        v-if="errors.banner"
        :id="ids.bannerError"
        role="alert"
        class="max-w-full break-words text-sm text-red-600"
      >
        {{ errors.banner }}
      </p>
    </div>

    <!-- Schedule Table -->
    <div class="space-y-2">
      <h3 class="text-[16px] font-bold text-gray-900">Time and days</h3>
      <div
        :id="ids.schedule"
        tabindex="-1"
        class="rounded-lg outline-none"
        :class="errors.schedule ? 'ring-2 ring-red-500/40 ring-offset-2' : ''"
      >
        <LessonScheduleTable
          :schedule="form.schedule"
          @update="updateSchedule"
        />
      </div>
      <p
        v-if="errors.schedule"
        role="alert"
        class="max-w-full break-words text-sm text-red-600"
      >
        {{ errors.schedule }}
      </p>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-center pt-4">
      <button
        type="submit"
        :disabled="isSubmitting || isLoading"
        class="inline-flex min-w-[140px] items-center justify-center rounded-lg bg-[#F76B00] px-8 py-3 text-[15px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#E55A00] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ isLoading ? 'Loading...' : (isSubmitting ? (isEditModeFromComposable ? 'Updating...' : 'Submitting...') : (isEditModeFromComposable ? 'Update' : 'Submit')) }}
      </button>
    </div>
  </form>
</template>
