<script setup lang="ts">
import { Eye, Trash2 } from 'lucide-vue-next'

const emit = defineEmits<{
  view: []
  delete: []
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <button
      type="button"
      class="inline-flex cursor-pointer items-center justify-center text-orange-500 transition-all duration-200 hover:opacity-80"
      aria-label="View teacher"
      @click="emit('view')"
    >
      <Eye class="lucide size-[20px] lucide-eye-icon lucide-eye size-[20px]" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="inline-flex cursor-pointer items-center justify-center text-red-500 transition-all duration-200 hover:opacity-80"
      aria-label="Delete teacher"
      @click="emit('delete')"
    >
      <Trash2 class="lucide size-[20px] lucide-eye-icon lucide-eye size-[20px]" aria-hidden="true" />
    </button>
  </div>
</template>
