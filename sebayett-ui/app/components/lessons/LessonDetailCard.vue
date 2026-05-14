<script setup lang="ts">
import type { LessonDetail } from '@/services/lessonService'
import LessonScheduleView from './LessonScheduleView.vue'

interface Props {
  lesson: LessonDetail
}

defineProps<Props>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="rounded-xl bg-white shadow-sm p-6">
    <!-- Top Section: Status, Title, Description, Meta Info -->
    <div class="space-y-4 mb-6">
      <!-- Status Badge and Title -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center">
          <span
            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border"
            :class="[
                lesson.status === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              ]"
          >
            {{ lesson.status === 'active' ? 'Active' : 'Paused' }}
          </span>
        </div>
        <h2 class="text-2xl font-bold text-[#F76B00]">
          {{ lesson.title }}
        </h2>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <p class="text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>

      <!-- Meta Info Row -->
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center gap-2 rounded-md px-4 py-2 border border-gray-200">
          <p class="text-sm text-gray-500">Category:</p>
          <p class="font-medium text-gray-900">{{ lesson.category }}</p>
        </div>

        <div class="flex items-center gap-2 rounded-md px-4 py-2 border border-gray-200">
          <p class="text-sm text-gray-500">Start Date:</p>
          <p class="font-medium text-gray-900">{{ formatDate(lesson.createdAt) }}</p>
        </div>

        <div class="flex items-center gap-2 rounded-md px-4 py-2 border border-gray-200">
          <p class="text-sm text-gray-500">Teacher:</p>
          <p class="font-medium text-gray-900">{{ lesson.teacher }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom Section: 2-Column Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- Left: Banner Image -->
      <div class="lg:col-span-1">
        <img
          :src="lesson.image"
          :alt="lesson.title"
          class="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <!-- Right: Schedule Table -->
      <div class="lg:col-span-1">
        <LessonScheduleView />
      </div>
    </div>
  </div>
</template>
