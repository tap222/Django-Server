<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    modelValue: string
    type?: 'text' | 'password' | 'email' | 'number' | 'date'
    /** Stable id for label association; generated when omitted */
    inputId?: string
    errorMessage?: string
  }>(),
  {
    label: '',
    placeholder: '',
    type: 'text',
    errorMessage: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uid = useId()
const resolvedId = computed(() => props.inputId ?? `fi-${uid}`)
const errorElId = computed(() => `${resolvedId.value}-error`)

const hasError = computed(() => !!props.errorMessage?.trim())

const inputClass = computed(() => {
  const base =
    'w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400'
  if (hasError.value) {
    return `${base} border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30`
  }
  return `${base} border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30`
})
</script>

<template>
  <div class="space-y-2">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-600"
      :for="resolvedId"
    >{{ label }}</label>
    <input
      :id="resolvedId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="inputClass"
      :aria-invalid="hasError || undefined"
      :aria-describedby="hasError ? errorElId : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p
      v-if="hasError"
      :id="errorElId"
      role="alert"
      class="max-w-full break-words text-sm text-red-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
