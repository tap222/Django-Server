<script setup lang="ts">
import { DataTable } from '~/components/ui/data-table'
import LessonActions from '~/components/lessons/LessonActions.vue'
import { useStatus } from '~/composables/useStatus'
import type { ColumnDef } from '~/components/ui/data-table'
import type { LessonRow } from '~/services/lessonService'

withDefaults(defineProps<{
  data: LessonRow[]
  loading: boolean
  page: number
  pageSize: number
  total: number
  hidePagination?: boolean
}>(), {
  hidePagination: false,
})

const emit = defineEmits<{
  view: [row: Record<string, unknown>]
  edit: [row: Record<string, unknown>]
  delete: [row: Record<string, unknown>]
  'update:page': [page: number]
}>()

const { getStatusColorClass, capitalize } = useStatus()

const columns: ColumnDef[] = [
  { key: 'title', label: 'Title', type: 'custom' },
  { key: 'status', label: 'Status' },
  { key: 'category', label: 'Categories' },
  { key: 'action', label: 'Action' },
]
</script>

<template>
  <DataTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :total="total"
      :page="page"
      :page-size="pageSize"
      :hide-pagination="hidePagination"
      @update:page="emit('update:page', $event)"
      @view="emit('view', $event)"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    >
      <template #cell-title="{ row }">
        <div class="flex items-center gap-3">
          <img
            :src="row.thumbnail"
            :alt="row.title"
            class="h-10 w-16 shrink-0 rounded-md object-cover shadow-sm"
          >
          <span class="text-sm font-semibold text-gray-900">{{ row.title }}</span>
        </div>
      </template>

      <template #cell-status="{ row }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border',
            getStatusColorClass(row.status)
          ]"
        >
          {{ capitalize(row.status) }}
        </span>
      </template>

      <template #cell-category="{ row }">
        <span class="text-sm text-gray-900 font-medium">{{ row.category }}</span>
      </template>


      <template #cell-action="{ row }">
        <LessonActions
          :row="row"
          @view="emit('view', $event)"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </template>
  </DataTable>
</template>
