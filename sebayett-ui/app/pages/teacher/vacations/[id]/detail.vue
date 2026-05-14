<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trash2, Edit } from 'lucide-vue-next'
import ActionButton from '~/components/common/ActionButton.vue'
import BackButton from '~/components/common/BackButton.vue'
import DeleteConfirmModal from '~/components/common/DeleteConfirmModal.vue'
import { useVacations } from '~/composables/useVacations'
import type { VacationRow } from '~/composables/useVacations'
import { useStatus } from '~/composables/useStatus'

definePageMeta({ allowedRoles: ['teacher'] })

const route = useRoute()
const { vacations, removeVacation } = useVacations()
const { getStatusColorClass, capitalize } = useStatus()

const vacationId = Number(route.params.id)
const vacation = computed(() => vacations.value.find(v => v.id === vacationId))

const detailRows = [
  { label: 'Vacations Title', key: 'title' },
  { label: 'Status', key: 'status' },
  { key: 'startDate', label: 'Start date' },
  { key: 'endDate', label: 'End date' },
  { key: 'duration', label: 'Duration' },
]

const showDeleteModal = ref(false)
const isDeleting = ref(false)

async function confirmDelete() {
  if (!vacation.value) return
  isDeleting.value = true
  try {
    await removeVacation(vacation.value.id)
    showDeleteModal.value = false
    navigateTo('/teacher/vacations')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="vacation">
      <header class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-[30px] font-bold leading-tight text-gray-900">Vacations Details</h1>
        <div class="flex items-center gap-3">
          <ActionButton label="Edit" variant="blue" @click="navigateTo(`/teacher/vacations/${vacationId}/edit`)">
            <template #icon><Edit class="size-4" aria-hidden="true" /></template>
          </ActionButton>
          <ActionButton label="Delete" variant="red" @click="showDeleteModal = true">
            <template #icon><Trash2 class="size-4" aria-hidden="true" /></template>
          </ActionButton>
          <BackButton />
        </div>
      </header>

      <div class="rounded-2xl bg-white p-8 shadow-sm">
        <div class="space-y-6">
          <div v-for="row in detailRows" :key="row.key" class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
            <p class="w-full shrink-0 text-sm font-bold text-gray-900 sm:w-44">{{ row.label }}:</p>
            <div v-if="row.key === 'status'">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border',
                  getStatusColorClass((vacation as any).status)
                ]"
              >
                {{ capitalize((vacation as any).status) }}
              </span>
            </div>
            <p v-else class="text-sm font-medium text-gray-600 sm:text-base">{{ (vacation as any)[row.key] }}</p>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        :is-open="showDeleteModal"
        title="Delete Vacation?"
        :message="`Are you sure you want to delete '${vacation.title}'?`"
        confirm-label="Delete"
        :loading="isDeleting"
        @close="showDeleteModal = false"
        @confirm="confirmDelete"
      />
    </template>

    <template v-else>
      <header class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-[30px] font-bold leading-tight text-gray-900">Vacation not found</h1>
        <BackButton />
      </header>
      <div class="rounded-2xl bg-white p-8 shadow-sm">
        <p class="text-sm text-gray-600">No vacation matches this ID. Return to the list and try again.</p>
      </div>
    </template>
  </div>
</template>
