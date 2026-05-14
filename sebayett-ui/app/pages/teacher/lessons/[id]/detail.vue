<script setup lang="ts">
definePageMeta({
  allowedRoles: ['teacher'],
})

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLesson } from '@/composables/useLesson'
import LessonDetailCard from '@/components/lessons/LessonDetailCard.vue'
import LessonScheduleView from '@/components/lessons/LessonScheduleView.vue'
import LessonActionButtons from '@/components/lessons/LessonActionButtons.vue'
import PauseLessonModal from '@/components/modals/PauseLessonModal.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'

const route = useRoute()
const lessonId = parseInt(route.params.id as string)

const {
  lesson,
  isLoading,
  error,
  fetchLesson,
  pauseLesson,
  deleteLesson,
} = useLesson()

// Modal states
const isPauseModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

// Mock schedule data (in real app, this would come from lesson data)
const mockSchedule = [
  { day: 'Monday', enabled: true, startTime: '09:00 AM', endTime: '10:30 AM' },
  { day: 'Tuesday', enabled: true, startTime: '09:00 AM', endTime: '10:30 AM' },
  { day: 'Wednesday', enabled: false, startTime: '', endTime: '' },
  { day: 'Thursday', enabled: true, startTime: '09:00 AM', endTime: '10:30 AM' },
  { day: 'Friday', enabled: true, startTime: '09:00 AM', endTime: '10:30 AM' },
  { day: 'Saturday', enabled: false, startTime: '', endTime: '' },
  { day: 'Sunday', enabled: false, startTime: '', endTime: '' },
]

function handlePause() {
  pauseLesson(lessonId)
  isPauseModalOpen.value = false
}

function handleDelete() {
  deleteLesson(lessonId)
  isDeleteModalOpen.value = false
  // Navigate back to lessons list
  navigateTo('/teacher/lessons')
}

function openPauseModal() {
  isPauseModalOpen.value = true
}

function openDeleteModal() {
  isDeleteModalOpen.value = true
}

function closePauseModal() {
  isPauseModalOpen.value = false
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
}

onMounted(() => {
  fetchLesson(lessonId)
})
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
        <h1 class="text-[30px] font-bold leading-tight text-gray-900">Lesson Details</h1>
        <LessonActionButtons
          :lesson-id="lesson.id"
          @pause="openPauseModal"
          @edit="() => navigateTo(`/teacher/lessons/${lesson.id}/edit`)"
          @delete="openDeleteModal"
          @back="() => navigateTo('/teacher/lessons')"
        />
      </div>

      <!-- Unified Lesson Detail Card -->
      <LessonDetailCard :lesson="lesson" />
    </div>

    <!-- Modals -->
    <PauseLessonModal
      :is-open="isPauseModalOpen"
      :lesson-name="lesson?.title || ''"
      @confirm="handlePause"
      @close="closePauseModal"
    />

    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete Lessons?"
      message="Are you sure you want to delete this lesson? This action cannot be undone and all lesson data will be permanently removed."
      confirm-label="Delete Lessons"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    />
  </div>
</template>
