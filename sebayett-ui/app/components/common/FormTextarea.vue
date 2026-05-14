<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    placeholder?: string
    modelValue: string
    rows?: number
    /** Stable id for label association; generated when omitted */
    inputId?: string
    errorMessage?: string
  }>(),
  {
    placeholder: '',
    rows: 4,
    errorMessage: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uid = useId()
const resolvedId = computed(() => props.inputId ?? `fta-${uid}`)
const errorElId = computed(() => `${resolvedId.value}-error`)
const hasError = computed(() => !!props.errorMessage?.trim())

const textareaClass = computed(() => {
  const base =
    'w-full resize-y rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400'
  if (hasError.value) {
    return `${base} border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30`
  }
  return `${base} border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30`
})
</script>

<template>
  <div class="space-y-2">
    <label
      class="block text-sm font-medium text-gray-600"
      :for="resolvedId"
    >{{ label }}</label>
    <textarea
      :id="resolvedId"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :class="textareaClass"
      :aria-invalid="hasError || undefined"
      :aria-describedby="hasError ? errorElId : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
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
