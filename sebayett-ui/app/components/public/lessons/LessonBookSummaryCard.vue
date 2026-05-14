<script setup lang="ts">
import type { PublicLesson } from '~/config/lessons.content'
import LessonScheduleTable from '~/components/public/lessons/LessonScheduleTable.vue'

defineProps<{
  lesson: PublicLesson
}>()
</script>

<template>
  <section
    class="rounded-3xl border border-neutral-200 bg-white p-6 lg:p-8"
    aria-labelledby="book-summary-heading"
  >
    <h2 id="book-summary-heading" class="sr-only">
      Lesson information
    </h2>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="space-y-2">
        <label
          class="block text-sm font-medium text-neutral-600"
          :for="`lesson-title-${lesson.id}`"
        >
          Lesson Title:
        </label>
        <input
          :id="`lesson-title-${lesson.id}`"
          type="text"
          readonly
          tabindex="-1"
          class="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-800 outline-none"
          :value="lesson.title"
        >
      </div>
      <div class="space-y-2">
        <label
          class="block text-sm font-medium text-neutral-600"
          :for="`lesson-category-${lesson.id}`"
        >
          Lesson Category:
        </label>
        <input
          :id="`lesson-category-${lesson.id}`"
          type="text"
          readonly
          tabindex="-1"
          class="h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-800 outline-none"
          :value="lesson.badge"
        >
      </div>
    </div>

    <div class="mt-6 space-y-2">
      <label
        class="block text-sm font-medium text-neutral-600"
        :for="`lesson-description-${lesson.id}`"
      >
        Lesson Description:
      </label>
      <textarea
        :id="`lesson-description-${lesson.id}`"
        :value="lesson.detailDescription"
        readonly
        tabindex="-1"
        rows="5"
        class="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm leading-relaxed text-neutral-800 outline-none"
      />
    </div>

    <div class="mt-6 space-y-3">
      <p class="text-sm font-semibold text-neutral-600">
        Schedule
      </p>
      <LessonScheduleTable variant="book" :rows="lesson.schedule" />
    </div>

    <p class="mt-6 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
      <span>This Lesson is limited From :</span>
      <span
        class="rounded-lg bg-neutral-100 px-4 py-2 text-neutral-800"
      >
        {{ lesson.availabilityFrom }}
      </span>
      <span>To</span>
      <span
        class="rounded-lg bg-neutral-100 px-4 py-2 text-neutral-800"
      >
        {{ lesson.availabilityTo }}
      </span>
    </p>
  </section>
</template>
