<script setup lang="ts">

definePageMeta({
  allowedRoles: ['teacher'],
})

import { onMounted, ref } from 'vue'
import { useLessons } from '~/composables/useLessons'
import LessonTable from '~/components/lessons/LessonTable.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'

const { lessons, loading, page, pageSize, total, fetchLessons, goToPage, removeLesson } = useLessons()

const isDeleteModalOpen = ref(false)
const lessonToDelete = ref<number | null>(null)

onMounted(fetchLessons)

function onView(row: Record<string, unknown>) {
  navigateTo(`/teacher/lessons/${row.id}/detail`)
}

function onEdit(row: Record<string, unknown>) {
  navigateTo(`/teacher/lessons/${row.id}/edit`)
}

function onDelete(row: Record<string, unknown>) {
  lessonToDelete.value = Number(row.id)
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (lessonToDelete.value !== null) {
    removeLesson(lessonToDelete.value)
    isDeleteModalOpen.value = false
    lessonToDelete.value = null
  }
}

</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header Section -->
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="text-[30px] font-bold leading-tight text-gray-900">Lessons</h1>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-[#F76B00] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#E55A00] focus:outline-none focus:ring-2 focus:ring-[#F76B00] focus:ring-offset-2 active:scale-95"
        @click="navigateTo('/teacher/lessons/create')"
      >
        Create Lesson
      </button>
    </div>

    <!-- Table Section -->
    <div class="overflow-hidden">
      <LessonTable
        :data="lessons"
        :loading="loading"
        :page="page"
        :page-size="pageSize"
        :total="total"
        @view="onView"
        @edit="onEdit"
        @delete="onDelete"
        @update:page="goToPage"
      />
    </div>

    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete Lesson?"
      message="Are you sure you want to delete this lesson? This action cannot be undone."
      confirm-label="Delete Lesson"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>


