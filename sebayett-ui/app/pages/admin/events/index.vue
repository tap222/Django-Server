<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin', 'teacher'] })

import { ref, computed, onMounted } from 'vue'
import { useEvents } from '@/composables/useEvents'
import { DataTable } from '@/components/ui/data-table'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import type { ColumnDef } from '@/components/ui/data-table'
import type { EventRow } from '@/services/eventService'

const { events, loading, page, pageSize, total, fetchEvents, goToPage, changePageSize, deleteEvent } = useEvents()

const isDeleteModalOpen = ref(false)
const selectedEvent = ref<EventRow | null>(null)

const columns = computed<ColumnDef[]>(() => [
  { key: 'title', label: 'Title', type: 'custom', meta: { imageKey: 'thumbnail' } },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'server', label: 'Server' },
  { key: 'lesson', label: 'Lesson' },
  { key: 'teacher', label: 'Teacher' },
  { key: 'time', label: 'Time' },
  { key: 'date', label: 'Date' },
  { key: 'created_at', label: 'Created at' },
  { key: 'action', label: 'Action', type: 'action' as const },
])

onMounted(fetchEvents)

function onView(row: Record<string, unknown>) {
  const id = String(row.id ?? '')
  if (!id) return
  navigateTo(`/admin/events/${encodeURIComponent(id)}`)
}

function onDelete(row: Record<string, unknown>) {
  selectedEvent.value = row as EventRow
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!selectedEvent.value) return
  await deleteEvent(selectedEvent.value.id)
  isDeleteModalOpen.value = false
  selectedEvent.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-[30px] font-bold leading-tight text-gray-900">Events</h1>
    <div class="overflow-hidden">
      <DataTable
        :columns="columns"
        :data="events"
        :loading="loading"
        :page="page"
        :page-size="pageSize"
        :total="total"
        @update:page="goToPage"
        @update:page-size="changePageSize"
        @view="onView"
        @delete="onDelete"
      />
    </div>

    <DeleteConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Delete Event?"
      :message="`Are you sure you want to delete '${selectedEvent?.title}'?`"
      entityName=""
      confirmLabel="Delete Event"
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>
