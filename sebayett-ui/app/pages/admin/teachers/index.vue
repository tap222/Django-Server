<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { ref, onMounted } from 'vue'
import { useTeachers } from '@/composables/useTeachers'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import TeacherTableActionButtons from '@/components/teachers/TeacherTableActionButtons.vue'
import { DataTable } from '@/components/ui/data-table'
import type { ColumnDef } from '@/components/ui/data-table'
import type { TeacherRow } from '@/services/teacherService'

const { teachers, loading, isDeleting, fetchTeachers, deleteTeacher } = useTeachers()
const showDeleteModal = ref(false)
const selectedTeacher = ref<TeacherRow | null>(null)

const columns: ColumnDef[] = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'expertise', label: 'Expertise' },
  { key: 'gender', label: 'Gender' },
  { key: 'dob', label: 'Date Of Birth' },
  { key: 'action', label: 'Action' },
]

onMounted(fetchTeachers)

function handleView(row: Record<string, unknown>) {
  const id = row.id
  if (typeof id !== 'string' || !id) return
  navigateTo(`/admin/teachers/${encodeURIComponent(id)}`)
}

function handleDelete(row: Record<string, unknown>) {
  selectedTeacher.value = row as TeacherRow
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!selectedTeacher.value) return
  await deleteTeacher(selectedTeacher.value.id)
  showDeleteModal.value = false
  selectedTeacher.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-[30px] font-bold leading-tight text-gray-900">Teachers</h1>
    </header>

    <div class="overflow-hidden">
      <DataTable :columns="columns" :data="teachers" :loading="loading">
        <template #cell-action="{ row }">
          <TeacherTableActionButtons @view="handleView(row)" @delete="handleDelete(row)" />
        </template>
      </DataTable>
    </div>

    <DeleteConfirmModal
      :is-open="showDeleteModal"
      title="Delete Teacher?"
      :message="selectedTeacher ? `Are you sure you want to delete '${selectedTeacher.firstName} ${selectedTeacher.lastName}'?` : ''"
      :entity-name="selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : ''"
      confirm-label="Delete Teacher"
      :loading="isDeleting"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
