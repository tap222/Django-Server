<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { ref, onMounted, computed } from 'vue'
import { Eye, PauseCircle, PlayCircle, Trash2 } from 'lucide-vue-next'
import { useLessons } from '@/composables/useLessons'
import { DataTable } from '@/components/ui/data-table'
import { Tooltip } from '@/components/ui/tooltip'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import PauseConfirmModal from '@/components/common/PauseConfirmModal.vue'
import type { ColumnDef } from '@/components/ui/data-table'
import { lessonService } from '@/services/lessonService'
import type { LessonRow } from '@/services/lessonService'

const { lessons, loading, page, pageSize, total, fetchLessons, goToPage, changePageSize, removeLesson } = useLessons()

const isDeleteModalOpen = ref(false)
const isPauseModalOpen = ref(false)
const selectedLesson = ref<LessonRow | null>(null)
const isDeleting = ref(false)
const isPausing = ref(false)

onMounted(fetchLessons)

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title', type: 'custom' },
  { key: 'category', label: 'Categories' },
  { key: 'teacher', label: 'Teacher' },
  { key: 'createdAt', label: 'Created at' },
  { key: 'action', label: 'Action' },
]

function onView(row: Record<string, unknown>) {
  navigateTo(`/admin/lessons/${row.id}`)
}

async function onTogglePause(row: any) {
  selectedLesson.value = row as LessonRow
  if (row.status === 'paused') {
    await handlePauseConfirm()
  } else {
    isPauseModalOpen.value = true
  }
}

async function handlePauseConfirm() {
  if (!selectedLesson.value) return
  isPausing.value = true
  try {
    const newStatus = selectedLesson.value.status === 'paused' ? 'active' : 'paused'
    await lessonService.updateLesson(selectedLesson.value.id, { status: newStatus })
    isPauseModalOpen.value = false
    await fetchLessons()
  } finally {
    isPausing.value = false
  }
}

function onDelete(row: Record<string, unknown>) {
  selectedLesson.value = row as LessonRow
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!selectedLesson.value) return
  isDeleting.value = true
  try {
    await removeLesson(Number(selectedLesson.value.id))
    isDeleteModalOpen.value = false
    selectedLesson.value = null
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-[30px] font-bold leading-tight text-gray-900">Lessons</h1>

    <div class="overflow-hidden">
      <DataTable
        :columns="columns"
        :data="lessons"
        :loading="loading"
        :page="page"
        :page-size="pageSize"
        :total="total"
        @update:page="goToPage"
        @update:page-size="changePageSize"
      >
        <template #cell-title="{ row }">
          <div class="flex items-center gap-3 py-1">
            <img :src="(row.thumbnail as string)" alt="" class="h-10 w-16 shrink-0 rounded-md object-cover shadow-sm">
            <span class="font-semibold text-gray-900">{{ row.title }}</span>
          </div>
        </template>

        <template #cell-category="{ value }">
          <span class="font-medium text-gray-900">{{ value }}</span>
        </template>

        <template #cell-teacher="{ value }">
          <span class="font-medium text-gray-900">{{ value }}</span>
        </template>

        <template #cell-createdAt="{ value }">
          <span class="font-medium text-gray-900">{{ value }}</span>
        </template>

        <template #cell-action="{ row }">
          <div class="flex items-center gap-2 justify-center">
            <Tooltip text="View Details">
              <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-md text-orange-400 transition-colors hover:bg-orange-50" @click="onView(row)">
                <Eye class="h-5 w-5" />
              </button>
            </Tooltip>
            
            <Tooltip :text="row.status === 'paused' ? 'Resume Lesson' : 'Pause Lesson'">
              <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-50" @click="onTogglePause(row)">
                <component :is="row.status === 'paused' ? PlayCircle : PauseCircle" class="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip text="Delete">
              <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-50" @click="onDelete(row)">
                <Trash2 class="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        </template>
      </DataTable>
    </div>
    
    <DeleteConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Delete Lesson?"
      :message="`Are you sure you want to delete '${selectedLesson?.title}'?`"
      entityName=""
      confirmLabel="Delete Lesson"
      :loading="isDeleting"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />

    <PauseConfirmModal
      :isOpen="isPauseModalOpen"
      title="Pause Lesson?"
      :message="`Are you sure you want to pause '${selectedLesson?.title}'?`"
      confirmLabel="Pause Lessons"
      :loading="isPausing"
      @close="isPauseModalOpen = false"
      @confirm="handlePauseConfirm"
    />
  </div>
</template>
