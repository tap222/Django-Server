<script setup lang="ts">
import { ref } from 'vue'
import { DataTable } from '~/components/ui/data-table'
import type { ColumnDef } from '~/components/ui/data-table'

definePageMeta({ allowedRoles: ['student'] })

const columns: ColumnDef[] = [
  { key: 'title', label: 'Event Title' },
  { key: 'server', label: 'Server' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'time', label: 'Time' },
  { key: 'date', label: 'Date' },
  { key: 'bought', label: 'Bought' },
]

// Mock data based on the provided image
const tickets = ref([
  {
    title: 'AI Innovation Summit',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=200',
    server: "Kajal's server",
    category: 'Computer Science',
    status: 'Canceled',
    time: '11 a.m.',
    date: 'March 2, 2026',
    bought: 'March 14, 2026',
  },
  {
    title: 'Frontend Friday',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=200',
    server: "Kajal's server",
    category: 'Psychology',
    status: 'Refunded',
    time: '10 a.m.',
    date: 'March 3, 2026',
    bought: 'March 15, 2026',
  },
  {
    title: 'Ethical Hacking Basics',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200',
    server: "Kajal's server",
    category: 'History',
    status: 'Active',
    time: '9 a.m.',
    date: 'March 5, 2026',
    bought: 'March 18, 2026',
  },
  {
    title: 'Startup Pitch Night',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=200',
    server: "Kajal's server",
    category: 'Math',
    status: 'Rescheduled',
    time: '8 a.m.',
    date: 'March 7, 2026',
    bought: 'March 20, 2026',
  },
  {
    title: 'Productivity Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=200',
    server: "Kajal's server",
    category: 'Physics',
    status: 'Completed',
    time: '9 a.m.',
    date: 'March 10, 2026',
    bought: 'March 22, 2026',
  },
])

const loading = ref(false)

function getStatusColorClass(status: string) {
  switch (status.toLowerCase()) {
    case 'canceled':
      return 'bg-red-50 text-red-500 border-red-100'
    case 'refunded':
      return 'bg-orange-50 text-orange-500 border-orange-100'
    case 'active':
      return 'bg-[#10B981] text-white border-[#10B981]'
    case 'rescheduled':
      return 'bg-blue-50 text-blue-500 border-blue-100'
    case 'completed':
      return 'bg-emerald-50 text-emerald-500 border-emerald-100'
    default:
      return 'bg-gray-50 text-gray-500 border-gray-100'
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-[30px] font-bold leading-tight text-gray-900">Tickets</h1>
    </div>

    <div class="overflow-hidden">
      <DataTable
        :columns="columns"
        :data="tickets"
        :loading="loading"
        hide-pagination
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
            {{ value }}
          </span>
        </template>

        <!-- Custom Server/Category/Time/Date/Bought Cells -->
        <template #cell-server="{ value }">
          <span class="text-sm font-semibold text-gray-900">{{ value }}</span>
        </template>
        <template #cell-category="{ value }">
          <span class="text-sm font-semibold text-gray-900">{{ value }}</span>
        </template>
        <template #cell-time="{ value }">
          <span class="text-sm font-semibold text-gray-900">{{ value }}</span>
        </template>
        <template #cell-date="{ value }">
          <span class="text-sm font-semibold text-gray-900">{{ value }}</span>
        </template>
        <template #cell-bought="{ value }">
          <span class="text-sm font-semibold text-gray-900">{{ value }}</span>
        </template>
      </DataTable>
    </div>
  </div>
</template>
