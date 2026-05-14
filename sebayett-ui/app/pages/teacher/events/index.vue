<script setup lang="ts">
import { onMounted } from 'vue'
import { useEvents } from '~/composables/useEvents'
import { useStatus } from '~/composables/useStatus'
import { DataTable } from '~/components/ui/data-table'
import type { ColumnDef } from '~/components/ui/data-table'
import { Eye } from 'lucide-vue-next'
import { Tooltip } from '~/components/ui/tooltip'

definePageMeta({ allowedRoles: ['teacher'] })

const { events, loading, page, pageSize, total, fetchEvents, goToPage } = useEvents()
const { getStatusColorClass, capitalize } = useStatus()

onMounted(fetchEvents)

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'server', label: 'Server' },
  { key: 'date', label: 'Date' },
  { key: 'action', label: 'Action' },
]

function onView(row: any) {
  navigateTo(`/teacher/events/${row.id}`)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-[30px] font-bold leading-tight text-gray-900">Events</h1>
    </div>

    <div class="overflow-hidden">
      <DataTable
        :columns="columns"
        :data="events"
        :loading="loading"
        :page="page"
        :page-size="pageSize"
        :total="total"
        @update:page="goToPage"
      >
        <!-- Custom Title Cell with Thumbnail -->
        <template #cell-title="{ row, value }">
          <div class="flex items-center gap-3">
            <img :src="(row as any).thumbnail" :alt="value" class="h-10 w-16 rounded-md object-cover shadow-sm">
            <span class="text-sm font-semibold text-gray-900">{{ value }}</span>
          </div>
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

        <!-- Custom Date/Server Cells -->
        <template #cell-server="{ value }">
          <span class="text-sm font-medium text-gray-900">{{ value }}</span>
        </template>
        <template #cell-date="{ value }">
          <span class="text-sm font-medium text-gray-900">{{ value }}</span>
        </template>

        <!-- Custom Action Cell -->
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
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>


