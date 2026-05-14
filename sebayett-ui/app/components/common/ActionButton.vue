<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label: string
  variant: 'blue' | 'red' | 'gray' | 'dark-gray'
}>()

const emit = defineEmits<{
  click: []
}>()

const variantClass = computed(() => {
  switch (props.variant) {
    case 'blue':
      return 'bg-[#6681C4] text-white hover:bg-[#5570B3]'
    case 'red':
      return 'bg-red-500 text-white hover:bg-red-600'
    case 'dark-gray':
      return 'bg-gray-500 text-white hover:bg-gray-600'
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }
})
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
        variantClass,
      )
    "
    @click="emit('click')"
  >
    <slot name="icon" />
    {{ label }}
  </button>
</template>
