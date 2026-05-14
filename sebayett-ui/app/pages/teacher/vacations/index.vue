<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useVacations } from '~/composables/useVacations'
import { useStatus } from '~/composables/useStatus'
import { DataTable } from '~/components/ui/data-table'
import type { ColumnDef } from '~/components/ui/data-table'
import { Eye, Edit, Trash2 } from 'lucide-vue-next'
import { Tooltip } from '~/components/ui/tooltip'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'

definePageMeta({ allowedRoles: ['teacher'] })

const { vacations, loading, page, pageSize, total, fetchVacations, goToPage, removeVacation } = useVacations()
const { getStatusColorClass, capitalize } = useStatus()

const isDeleteModalOpen = ref(false)
const selectedVacation = ref<any>(null)
const isDeleting = ref(false)

onMounted(fetchVacations)

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'duration', label: 'Duration' },
  { key: 'action', label: 'Action' },
]

function onView(row: any) {
  navigateTo(`/teacher/vacations/${row.id}/detail`)
}

function onEdit(row: any) {
  navigateTo(`/teacher/vacations/${row.id}/edit`)
}

function onDelete(row: any) {
  selectedVacation.value = row
  isDeleteModalOpen.value = true
}

async function handleConfirmDelete() {
  if (!selectedVacation.value) return
  isDeleting.value = true
  try {
    await removeVacation(selectedVacation.value.id)
    isDeleteModalOpen.value = false
    selectedVacation.value = null
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-[30px] font-bold leading-tight text-gray-900">Vacations</h1>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-[#F76B00] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#E55A00]"
        @click="navigateTo('/teacher/vacations/create')"
      >
        Create Vacations
      </button>
    </div>

    <div class="overflow-hidden">
      <DataTable
        :columns="columns"
        :data="vacations"
        :loading="loading"
        :page="page"
        :page-size="pageSize"
        :total="total"
        hide-pagination
        @update:page="goToPage"
      >
        <!-- Custom Title Cell -->
        <template #cell-title="{ value }">
          <span class="text-sm font-semibold text-gray-900">{{ value }}</span>
        </template>

        <!-- Custom Status Cell -->
        <template #cell-status="{ value }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border',
              getStatusColorClass(value as string)
            ]"
          >
            {{ capitalize(value as string) }}
          </span>
        </template>

        <!-- Custom Date/Duration Cells -->
        <template #cell-startDate="{ value }">
          <span class="text-sm font-medium text-gray-900">{{ value }}</span>
        </template>
        <template #cell-endDate="{ value }">
          <span class="text-sm font-medium text-gray-900">{{ value }}</span>
        </template>
        <template #cell-duration="{ value }">
          <span class="text-sm font-medium text-gray-900">{{ value }}</span>
        </template>

        <template #cell-action="{ row }">
          <div class="flex items-center justify-center gap-2">
            <Tooltip text="View">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#F76B00] transition-colors hover:bg-[#FFF4ED]"
                @click="onView(row)"
              >
                <Eye class="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip text="Edit">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6681C4] transition-colors hover:bg-[#6681C4]/10"
                @click="onEdit(row)"
              >
                <Edit class="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip text="Delete">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
                @click="onDelete(row)"
              >
                <Trash2 class="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        </template>
      </DataTable>
    </div>

    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete Vacation?"
      :message="`Are you sure you want to delete '${selectedVacation?.title}'?`"
      confirm-label="Delete"
      :loading="isDeleting"
      @close="isDeleteModalOpen = false"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>


