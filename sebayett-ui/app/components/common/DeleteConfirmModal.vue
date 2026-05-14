<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title: string
  message: string
  entityName?: string
  confirmLabel?: string
  loading?: boolean
}>(), {
  entityName: '',
  confirmLabel: 'Delete',
  loading: false,
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

function onOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget && !props.loading) {
    emit('close')
  }
}

function onConfirm() {
  if (props.loading) return
  emit('confirm')
}

function onClose() {
  if (props.loading) return
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (!props.isOpen || props.loading) return
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      @click="onOverlayClick"
    >
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <h2 class="text-[28px] font-bold text-gray-900">
            {{ title }}
          </h2>
          <p class="mt-3 text-lg font-medium text-gray-700">
            {{ message }}
          </p>

          <div class="mt-8 flex justify-center gap-4">
            <button
              type="button"
              class="min-w-[120px] rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-base font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="loading"
              @click="onClose"
            >
              Cancel
            </button>
            <button
              type="button"
              class="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-2.5 text-base font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
              :disabled="loading"
              @click="onConfirm"
            >
              <Trash2 class="size-5" aria-hidden="true" />
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
