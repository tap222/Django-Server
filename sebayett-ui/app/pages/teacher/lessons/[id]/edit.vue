<script setup lang="ts">
definePageMeta({
  allowedRoles: ['teacher'],
})

import { useRoute } from 'vue-router'
import BackButton from '@/components/common/BackButton.vue'
import LessonForm from '@/components/lessons/LessonForm.vue'
import { useLesson } from '@/composables/useLesson'

const route = useRoute()
const lessonId = parseInt(route.params.id as string)

const {
  lesson,
  isLoading,
  error,
  fetchLesson,
} = useLesson()

function goBack() {
  navigateTo('/teacher/lessons')
}

// Fetch lesson data when component mounts
fetchLesson(lessonId)
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="text-lg text-gray-600">Loading lesson...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center py-12">
      <div class="text-lg text-red-600">{{ error }}</div>
    </div>

    <!-- Lesson Content -->
    <div v-else-if="lesson" class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-[30px] font-bold leading-tight text-gray-900">Edit Lesson</h1>
        <BackButton />
      </div>

      <!-- Form Container -->
      <div class="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <LessonForm 
          :lesson-id="lessonId" 
          :is-edit-mode="true"
        />
      </div>
    </div>
  </div>
</template>
