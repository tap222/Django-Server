<script setup lang="ts">
import { Pause, Edit, Trash2 } from 'lucide-vue-next'
import BackButton from '@/components/common/BackButton.vue'

interface Props {
  lessonId: number
}

const emit = defineEmits<{
  pause: [id: number]
  edit: [id: number]
  delete: [id: number]
  back: []
}>()

defineProps<Props>()
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <!-- Pause Button -->
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      @click="emit('pause', lessonId)"
    >
      <Pause class="h-4 w-4 mr-2" />
      Pause
    </button>

    <!-- Edit Button -->
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-lg bg-[#6681C4] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#5570B3] focus:outline-none focus:ring-2 focus:ring-[#6681C4] focus:ring-offset-2"
      @click="emit('edit', lessonId)"
    >
      <Edit class="h-4 w-4 mr-2" />
      Edit
    </button>

    <!-- Delete Button -->
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      @click="emit('delete', lessonId)"
    >
      <Trash2 class="h-4 w-4 mr-2" />
      Delete
    </button>

    <!-- Back Button -->
    <BackButton @click="emit('back')" />
  </div>
</template>
