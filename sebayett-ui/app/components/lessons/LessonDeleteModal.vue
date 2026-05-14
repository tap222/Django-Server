<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isOpen: boolean
  lessonId: number
}

const emit = defineEmits<{
  confirm: [id: number]
  close: []
}>()

defineProps<Props>()

function handleConfirm() {
  emit('confirm', props.lessonId)
  emit('close')
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="handleClose"
    />

    <!-- Modal -->
    <div class="relative z-10 bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Delete Lessons?
      </h3>

      <!-- Message -->
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete this lesson? This action cannot be undone and all lesson data will be permanently removed.
      </p>

      <!-- Buttons -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          @click="handleClose"
        >
          Cancel
        </button>
        
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          @click="handleConfirm"
        >
          Delete Lessons
        </button>
      </div>
    </div>
  </div>
</template>
