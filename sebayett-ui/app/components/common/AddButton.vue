<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    label: 'Add Bot',
    type: 'button',
  },
)

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>
