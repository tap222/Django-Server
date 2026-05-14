<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  text: string
  position?: 'top' | 'bottom'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  delay: 200,
})

const isVisible = ref(false)
const timeoutRef = ref<number | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    case 'bottom':
      return 'top-full left-1/2 -translate-x-1/2 mt-2'
    default:
      return 'top-full left-1/2 -translate-x-1/2 mt-2'
  }
})

function showTooltip() {
  if (timeoutRef.value) clearTimeout(timeoutRef.value)

  timeoutRef.value = window.setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

function hideTooltip() {
  if (timeoutRef.value) clearTimeout(timeoutRef.value)

  timeoutRef.value = window.setTimeout(() => {
    isVisible.value = false
  }, 100)
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null
  if (triggerRef.value && target && !triggerRef.value.contains(target)) {
    hideTooltip()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  if (timeoutRef.value) clearTimeout(timeoutRef.value)
})
</script>

<template>
  <div class="relative inline-flex">
    <!-- Tooltip -->
    <div
      v-if="isVisible"
      :class="cn(
        'absolute z-50 px-3 py-1.5 text-sm text-gray-700 bg-white rounded-md shadow-md whitespace-nowrap pointer-events-none',
        'transition-all duration-200 ease-in-out',
        positionClasses
      )"
      role="tooltip"
    >
      {{ text }}

      <!-- Modern Arrow (Rotated Square) -->
      <div
        :class="cn(
          'absolute w-2.5 h-2.5 bg-white rotate-45 shadow-sm',
          props.position === 'top'
            ? 'top-full left-1/2 -translate-x-1/2 -mt-1'
            : 'bottom-full left-1/2 -translate-x-1/2 -mb-1'
        )"
      />
    </div>

    <!-- Trigger -->
    <div
      ref="triggerRef"
      class="inline-flex"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focusin="showTooltip"
      @focusout="hideTooltip"
    >
      <slot />
    </div>
  </div>
</template>