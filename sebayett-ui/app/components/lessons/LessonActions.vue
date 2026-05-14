<script setup lang="ts">
import { Eye, Edit, Trash2 } from 'lucide-vue-next'
import { Tooltip } from '~/components/ui/tooltip'

defineProps<{ row: Record<string, unknown> }>()
const emit = defineEmits<{
  view: [row: Record<string, unknown>]
  edit: [row: Record<string, unknown>]
  delete: [row: Record<string, unknown>]
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <Tooltip text="View Lesson">
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#F76B00] transition-colors hover:bg-[#FFF4ED]"
        aria-label="View lesson"
        @click="emit('view', row)"
      >
        <Eye class="h-5 w-5" aria-hidden="true" />
      </button>
    </Tooltip>

    <Tooltip text="Edit Lesson">
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6681C4] transition-colors hover:bg-[#6681C4]/10"
        aria-label="Edit lesson"
        @click="emit('edit', row)"
      >
        <Edit class="h-5 w-5" aria-hidden="true" />
      </button>
    </Tooltip>

    <Tooltip text="Delete Lesson">
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
        aria-label="Delete lesson"
        @click="emit('delete', row)"
      >
        <Trash2 class="h-5 w-5" aria-hidden="true" />
      </button>
    </Tooltip>
  </div>
</template>
