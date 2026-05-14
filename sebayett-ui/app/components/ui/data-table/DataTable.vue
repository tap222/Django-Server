<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import TableCellRenderer from './TableCellRenderer.vue'
import type { ColumnDef } from './types'

type RowData = Record<string, unknown>

const props = withDefaults(defineProps<{
  columns: ColumnDef[]
  data: RowData[]
  loading?: boolean
  total?: number
  page?: number
  pageSize?: number
  hidePagination?: boolean
}>(), {
  loading: false,
  total: undefined,
  page: undefined,
  pageSize: 8,
  hidePagination: false,
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
  view: [row: RowData]
  delete: [row: RowData]
}>()

const hasPagination = computed(() => (
  !props.hidePagination
  && typeof props.total === 'number'
  && typeof props.page === 'number'
  && typeof props.pageSize === 'number'
))

const totalPages = computed(() => {
  if (!hasPagination.value || !props.pageSize) return 0
  return Math.max(1, Math.ceil(props.total! / props.pageSize))
})

const startItem = computed(() => {
  if (!hasPagination.value || !props.pageSize || !props.total) return 0
  return (props.page! - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  if (!hasPagination.value || !props.pageSize || !props.total) return 0
  return Math.min(props.page! * props.pageSize, props.total!)
})

const rangeText = computed(() => {
  if (!hasPagination.value || startItem.value === 0 || endItem.value === 0) {
    return ''
  }
  const start = String(startItem.value).padStart(2, '0')
  const end = String(endItem.value).padStart(2, '0')
  return `${start}-${end} out of ${props.total}`
})

const displayedPages = computed(() => {
  if (!hasPagination.value || totalPages.value === 0 || !props.page) return []

  const total = totalPages.value
  const current = props.page
  const pages: (number | string)[] = []

  if (total <= 8) {
    for (let i = 1; i <= total; i += 1) pages.push(i)
    return pages
  }

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', total)
  } else if (current >= total - 3) {
    pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }

  return pages
})

const skeletonRows = computed(() => Math.max(3, Math.min(props.pageSize ?? 8, 8)))

function updatePage(nextPage: number | string) {
  if (typeof nextPage === 'string') return
  if (!hasPagination.value || nextPage < 1 || nextPage > totalPages.value || nextPage === props.page) {
    return
  }
  emit('update:page', nextPage)
}

function updatePageSize(size: string) {
  emit('update:pageSize', Number(size))
  emit('update:page', 1)
}

function getCellValue(row: RowData, key: string) {
  return row[key]
}
</script>

<template>
  <section class="overflow-hidden rounded-2xl bg-white shadow-sm px-4 sm:px-5">
    <div class="max-h-[calc(100vh-250px)] overflow-auto">
      <table class="w-full min-w-[760px] text-sm">
        <thead class="sticky top-0 z-10 bg-white">
          <tr class="border-b border-gray-100">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="[
                'px-4 py-4 text-left text-sm font-semibold tracking-wide text-gray-500 first:pl-5 last:pr-5',
                (column.key === 'status' || column.key === 'action') && 'text-sm font-semibold text-gray-400',
                column.key === 'action' && 'text-center',
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" v-for="rowIndex in skeletonRows" :key="`skeleton-${rowIndex}`" class="border-b border-gray-100 last:border-b-0">
            <td
              v-for="column in columns"
              :key="`skeleton-${rowIndex}-${column.key}`"
              class="px-4 py-2.5 first:pl-5 last:pr-5"
            >
              <div class="h-4 w-full animate-pulse rounded bg-gray-100" />
            </td>
          </tr>

          <tr v-else-if="data.length === 0">
            <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-gray-500">
              No data found
            </td>
          </tr>

          <tr
            v-else
            v-for="(row, rowIndex) in data"
            :key="`row-${rowIndex}`"
            class="border-b border-gray-100 last:border-b-0 transition-colors duration-150 hover:bg-gray-50/80"
          >
            <td
              v-for="column in columns"
              :key="`${rowIndex}-${column.key}`"
              :class="[
                'px-4 py-4 align-middle first:pl-5 last:pr-5',
                column.key === 'action' && 'text-center',
              ]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="getCellValue(row, column.key)"
              >
                <TableCellRenderer
                   :row="row"
                  :column="column"
                  :value="getCellValue(row, column.key)"
                  @view="emit('view', $event)"
                  @delete="emit('delete', $event)"
                />
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="hasPagination" class="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 text-sm text-gray-500 sm:h-14 sm:flex-row sm:gap-2 sm:py-0">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-gray-400">Rows per page:</span>
          <select
            :value="pageSize"
            class="rounded-md border border-gray-100 bg-white px-2 py-1 text-xs text-gray-600 outline-none transition-colors hover:border-orange-200 focus:border-orange-500"
            @change="updatePageSize(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="size in [8, 10, 20, 50]" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>
        <p class="m-0 text-gray-400">{{ rangeText }}</p>
      </div>

      <div class="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          class="inline-flex items-center rounded-md px-2 py-1 text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="(page ?? 1) <= 1"
          @click="updatePage((page ?? 1) - 1)"
        >
          <ChevronLeft class="size-4" />
          <span class="hidden sm:inline ml-1">Previous</span>
        </button>
        <button
          v-for="(pageNumber, idx) in displayedPages"
          :key="`page-${idx}`"
          type="button"
          :class="[
            'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm transition-colors sm:px-2',
            pageNumber === page
              ? 'bg-orange-500 text-white'
              : pageNumber === '...'
                ? 'cursor-default text-gray-400'
                : 'text-gray-600 hover:bg-gray-100',
          ]"
          @click="updatePage(pageNumber)"
        >
          {{ pageNumber }}
        </button>
        <button
          type="button"
          class="inline-flex items-center rounded-md px-2 py-1 text-orange-500 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="(page ?? 1) >= totalPages"
          @click="updatePage((page ?? 1) + 1)"
        >
          <span class="hidden sm:inline mr-1">Next</span>
          <ChevronRight class="size-4" />
        </button>
      </div>
    </div>
  </section>
</template>
