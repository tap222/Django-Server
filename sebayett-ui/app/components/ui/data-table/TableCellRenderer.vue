<script setup lang="ts">
import { computed } from 'vue'
import { Eye, Trash2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'
import type { ColumnDef } from './types'

type RowData = Record<string, unknown>

const props = defineProps<{
  value: unknown
  row: RowData
  column: ColumnDef
}>()

const emit = defineEmits<{
  view: [row: RowData]
  delete: [row: RowData]
}>()

const columnType = computed(() => props.column.type ?? 'default')
const badgeLabel = computed(() => String(props.value ?? ''))

const badgeClass = computed(() => {
  switch (badgeLabel.value.toLowerCase()) {
    case 'confirmed':
    case 'accepted':
      return 'border border-emerald-200 bg-emerald-50 text-emerald-600'
    case 'pending':
      return 'border border-amber-200 bg-amber-50 text-amber-600'
    case 'refused':
    case 'rejected':
      return 'border border-rose-200 bg-rose-50 text-rose-600'
    default:
      return 'border border-gray-200 bg-gray-50 text-gray-600'
  }
})

const customImageSrc = computed(() => {
  const imageKey = props.column.meta?.imageKey ?? 'thumbnail'
  const direct = props.row[imageKey]
  if (typeof direct === 'string') {
    return direct
  }
  if (direct && typeof direct === 'object' && 'src' in direct) {
    const src = (direct as { src?: unknown }).src
    return typeof src === 'string' ? src : ''
  }
  return ''
})

const customLabel = computed(() => {
  const labelKey = props.column.meta?.labelKey
  if (labelKey) {
    const fromLabelKey = props.row[labelKey]
    if (typeof fromLabelKey === 'string') {
      return fromLabelKey
    }
  }
  return String(props.value ?? '-')
})
</script>

<template>
  <span
    v-if="columnType === 'badge'"
    :class="cn('inline-flex items-center justify-center rounded-full px-3 py-1 text-xs leading-none', badgeClass)"
  >
    {{ badgeLabel }}
  </span>

  <div v-else-if="columnType === 'custom'" class="flex items-center gap-3">
    <img
      v-if="customImageSrc"
      :src="customImageSrc"
      alt=""
      class="h-10 w-16 shrink-0 rounded-md object-cover shadow-sm"
      loading="lazy"
    >
    <div
      v-else
      class="h-10 w-16 shrink-0 rounded-md bg-gray-100 shadow-sm"
      aria-hidden="true"
    />
    <span class="font-semibold text-gray-900">{{ customLabel }}</span>
  </div>

  <div v-else-if="columnType === 'action'" class="flex items-center gap-2">
    <Tooltip text="View Details">
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-orange-400 transition-colors hover:bg-orange-50"
        aria-label="View row"
        @click="emit('view', row)"
      >
        <Eye class="h-5 w-5" />
      </button>
    </Tooltip>
    <Tooltip text="Delete">
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-50"
        aria-label="Delete row"
        @click="emit('delete', row)"
      >
        <Trash2 class="h-5 w-5" />
      </button>
    </Tooltip>
  </div>

  <button
    v-else-if="columnType === 'view'"
    type="button"
    class="inline-flex h-8 w-8 items-center justify-center rounded-full text-orange-400 transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:text-orange-500"
    aria-label="View row"
    @click="emit('view', row)"
  >
    <Eye class="h-[19px] w-[19px]" />
  </button>

  <button
    v-else-if="columnType === 'actionButton'"
    type="button"
    class="rounded-lg bg-[#19B77E] px-2 py-1 text-sm text-white"
  >
    View Users with this role
  </button>

  <button
    v-else-if="columnType === 'delete'"
    type="button"
    class="inline-flex cursor-pointer items-center justify-center text-red-500"
    aria-label="Delete row"
    @click="emit('delete', row)"
  >
    <Trash2 class="h-5 w-5" />
  </button>

  <span v-else class="font-semibold text-gray-900">
    {{ value ?? '-' }}
  </span>
</template>
