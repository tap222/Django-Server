<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin', 'teacher'] })

import { ref } from 'vue'
import { Trash2, PauseCircle, PlayCircle } from 'lucide-vue-next'
import ActionButton from '@/components/common/ActionButton.vue'
import BackButton from '@/components/common/BackButton.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import PauseConfirmModal from '@/components/common/PauseConfirmModal.vue'
import { lessonService } from '@/services/lessonService'
import type { LessonDetail } from '@/services/lessonService'

const route = useRoute()
const id = Number(route.params.id)

const { data } = await useAsyncData(`lesson-${id}`, () => lessonService.getLessonById(id))
const lessonData = ref<LessonDetail | null>(data.value as LessonDetail | null)

const showDeleteModal = ref(false)
const showPauseModal = ref(false)
const isDeleting = ref(false)
const isPausing = ref(false)

async function onTogglePause() {
  if (!lessonData.value) return
  if (lessonData.value.status === 'paused') {
    await handlePauseConfirm()
  } else {
    showPauseModal.value = true
  }
}

async function handlePauseConfirm() {
  if (!lessonData.value) return
  isPausing.value = true
  try {
    const newStatus = lessonData.value.status === 'paused' ? 'active' : 'paused'
    await lessonService.updateLesson(id, { status: newStatus })
    if (lessonData.value) lessonData.value.status = newStatus
    showPauseModal.value = false
  } finally {
    isPausing.value = false
  }
}

async function confirmDelete() {
  if (!lessonData.value) return
  isDeleting.value = true
  try {
    await lessonService.deleteLesson(id)
    showDeleteModal.value = false
    navigateTo('/admin/lessons')
  } finally {
    isDeleting.value = false
  }
}

const detailRows = lessonData.value ? [
  { label: 'Lesson Title', value: lessonData.value.title },
  { label: 'Category', value: lessonData.value.category },
  { label: 'Teacher', value: lessonData.value.teacher },
  { label: 'Created at', value: lessonData.value.createdAt },
] : []
</script>

<template>
  <section>
    <template v-if="lessonData">
      <header class="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Lesson: {{ lessonData.title }}</h1>
        <div class="flex items-center gap-3">
          <ActionButton 
            :label="lessonData.status === 'paused' ? 'Resume' : 'Pause'" 
            variant="dark-gray" 
            @click="onTogglePause"
          >
            <template #icon>
              <component :is="lessonData.status === 'paused' ? PlayCircle : PauseCircle" class="size-4" aria-hidden="true" />
            </template>
          </ActionButton>
          <ActionButton label="Delete" variant="red" @click="showDeleteModal = true">
            <template #icon><Trash2 class="size-4" aria-hidden="true" /></template>
          </ActionButton>
          <BackButton />
        </div>
      </header>

      <div class="mt-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0 flex-1 space-y-5">
            <div v-for="row in detailRows" :key="row.label" class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
              <p class="w-full shrink-0 text-md font-medium text-gray-500 sm:w-44">{{ row.label }}:</p>
              <p class="text-md font-semibold text-gray-900 sm:text-base">{{ row.value }}</p>
            </div>
          </div>
          
          <div class="w-full lg:w-[480px] xl:w-[540px]">
            <img 
              v-if="lessonData.image" 
              :src="lessonData.image" 
              :alt="lessonData.title" 
              class="h-[260px] w-full rounded-2xl object-cover shadow-md sm:h-[320px] lg:h-[320px] xl:h-[360px]" 
              loading="lazy"
            >
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        :is-open="showDeleteModal"
        title="Delete Lesson?"
        :message="`Are you sure you want to delete '${lessonData.title}'?`"
        entityName=""
        confirm-label="Delete Lesson"
        :loading="isDeleting"
        @close="showDeleteModal = false"
        @confirm="confirmDelete"
      />

      <PauseConfirmModal
        :isOpen="showPauseModal"
        title="Pause Lesson?"
        :message="`Are you sure you want to pause '${lessonData.title}'?`"
        confirmLabel="Pause Lessons"
        :loading="isPausing"
        @close="showPauseModal = false"
        @confirm="handlePauseConfirm"
      />
    </template>

    <template v-else>
      <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Lesson not found</h1>
        <BackButton />
      </header>
      <p class="text-sm text-gray-600">No lesson matches this ID. Return to the list and try again.</p>
    </template>
  </section>
</template>
