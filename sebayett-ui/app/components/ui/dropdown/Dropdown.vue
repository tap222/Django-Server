<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  options: string[]
  modelValue?: string
  placeholder?: string
  widthClass?: string
  /** Id for the menu button (use with external <label for>) */
  buttonId?: string
  listboxId?: string
  errorMessage?: string
}>(), {
  modelValue: '',
  placeholder: 'Select option',
  widthClass: 'w-48',
  errorMessage: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uid = useId()
const resolvedButtonId = computed(() => props.buttonId ?? `dd-${uid}`)
const listboxIdResolved = computed(() => props.listboxId ?? `${resolvedButtonId.value}-listbox`)
const errorElId = computed(() => `${resolvedButtonId.value}-error`)
const hasError = computed(() => !!props.errorMessage?.trim())

const triggerClass = computed(() => {
  const base =
    'flex h-10 w-full items-center justify-between rounded-md border bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition-colors'
  if (hasError.value) {
    return cn(base, 'border-red-500 ring-1 ring-red-500/25')
  }
  return cn(base, 'border-gray-200')
})

const isOpen = ref(false)
const highlightedIndex = ref(-1)
const rootRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => props.modelValue || props.placeholder)

const selectedIndex = computed(() => (
  props.modelValue ? props.options.findIndex((option) => option === props.modelValue) : -1
))

function toggleDropdown() {
  isOpen.value = !isOpen.value
  highlightedIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : 0
}

function closeDropdown() {
  isOpen.value = false
  highlightedIndex.value = -1
}

function selectOption(option: string) {
  emit('update:modelValue', option)
  closeDropdown()
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null
  if (rootRef.value && target && !rootRef.value.contains(target)) {
    closeDropdown()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    toggleDropdown()
    return
  }

  if (!isOpen.value) return

  if (event.key === 'Escape') {
    closeDropdown()
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    const option = props.options[highlightedIndex.value]
    if (option) {
      selectOption(option)
    }
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div ref="rootRef" :class="cn('relative', widthClass)">
    <button
      :id="resolvedButtonId"
      type="button"
      :class="triggerClass"
      :aria-expanded="isOpen"
      :aria-invalid="hasError || undefined"
      :aria-describedby="hasError ? errorElId : undefined"
      aria-haspopup="listbox"
      :aria-controls="listboxIdResolved"
      @click="toggleDropdown"
      @keydown="onKeydown"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <ChevronDown
        :class="cn('h-4 w-4 shrink-0 text-gray-400 transition-transform', isOpen && 'rotate-180')"
        aria-hidden="true"
      />
    </button>

    <ul
      v-if="isOpen"
      :id="listboxIdResolved"
      class="absolute z-50 mt-1 w-full overflow-hidden rounded-md bg-white shadow-md"
      role="listbox"
    >
      <li
        v-for="(option, index) in options"
        :key="option"
        :class="
          cn(
            'cursor-pointer px-4 py-2 text-sm',
            option === modelValue
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100',
            highlightedIndex === index && option !== modelValue && 'bg-gray-100',
          )
        "
        role="option"
        :aria-selected="option === modelValue"
        @click="selectOption(option)"
      >
        {{ option }}
      </li>
    </ul>
    <p
      v-if="hasError"
      :id="errorElId"
      role="alert"
      class="mt-1 max-w-full break-words text-sm text-red-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
