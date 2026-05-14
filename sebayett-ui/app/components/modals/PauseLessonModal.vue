<script setup lang="ts">
import { watch } from 'vue'
import { Pause } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  isOpen: boolean
  lessonName: string
}>(), {
  lessonName: '',
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

function onClose() {
  emit('close')
}

function onConfirm() {
  emit('confirm')
}

function onOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    onClose()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (!props.isOpen)
    return
  if (event.key === 'Escape') {
    onClose()
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
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
          class="w-full max-w-lg rounded-2xl bg-white p-7 text-center shadow-xl sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Pause lesson confirmation"
        >
          <h2 class="text-4xl font-semibold text-gray-900">
            Pause Lesson?
          </h2>

          <p class="mt-4 text-lg text-gray-600">
            Are you sure you want to pause "{{ lessonName }}"?
          </p>

          <div class="mt-7 flex items-center justify-center gap-3">
            <button
              type="button"
              class="rounded-lg border border-gray-200 bg-white px-7 py-2.5 text-base font-medium text-gray-500 transition-colors hover:bg-gray-50"
              @click="onClose"
            >
              Cancel
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-orange-600"
              @click="onConfirm"
            >
              <Pause class="h-4 w-4" aria-hidden="true" />
              Pause Lessons
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
