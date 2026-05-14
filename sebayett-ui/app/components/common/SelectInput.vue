<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

defineProps<{
  label: string
  modelValue: string
  options: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="block space-y-2">
    <span class="text-sm font-medium text-gray-600">{{ label }}</span>
    <div class="relative">
      <select
        :value="modelValue"
        class="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <ChevronDown
        class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
    </div>
  </label>
</template>
