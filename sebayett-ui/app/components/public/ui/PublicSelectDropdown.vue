<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

export interface PublicSelectDropdownItem {
  value: string
  label: string
}

const model = defineModel<string>({ required: true })

const props = withDefaults(
  defineProps<{
    /** Plain string options (label and stored value are the same). */
    options?: string[]
    /** Label/value pairs when the stored value should differ from display text. */
    items?: PublicSelectDropdownItem[]
    triggerId: string
    listboxId?: string
    placeholder?: string
    /** Time-style: keep brand border after user picks an option */
    persistBrandAfterPick?: boolean
    errorMessage?: string
  }>(),
  {
    options: () => [],
    items: undefined,
    listboxId: undefined,
    placeholder: '',
    persistBrandAfterPick: false,
    errorMessage: '',
  },
)

const emit = defineEmits<{
  opened: []
  closed: []
}>()

const open = ref(false)
const hasPicked = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const listboxIdResolved = computed(
  () => props.listboxId ?? `${props.triggerId}-listbox`,
)

const errorElId = computed(() => `${props.triggerId}-error`)
const hasError = computed(() => !!props.errorMessage?.trim())

const rows = computed(() => {
  if (props.items?.length) {
    return props.items.map(i => ({ value: i.value, label: i.label }))
  }
  return props.options.map(o => ({ value: o, label: o }))
})

const displayLabel = computed(() => {
  const row = rows.value.find(r => r.value === model.value)
  return row?.label ?? ''
})

function toggle() {
  open.value = !open.value
}

function pick(value: string) {
  model.value = value
  hasPicked.value = true
  open.value = false
}

const triggerClass = computed(() => {
  const base =
    'flex h-11 w-full items-center justify-between rounded-lg border bg-white px-4 text-sm outline-none transition-all text-neutral-700'
  const brand = 'border-brand ring-1 ring-brand'
  const neutral =
    'border-neutral-200 hover:border-neutral-300 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand'
  const invalid = 'border-red-500 ring-1 ring-red-500/30'
  if (hasError.value) return `${base} ${invalid}`
  if (open.value) return `${base} ${brand}`
  if (props.persistBrandAfterPick && hasPicked.value) return `${base} ${brand}`
  return `${base} ${neutral}`
})

function closePanel() {
  open.value = false
}

function onDocumentPointerDown(ev: MouseEvent | PointerEvent) {
  const t = ev.target as Node
  if (rootRef.value?.contains(t)) return
  closePanel()
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key !== 'Escape') return
  closePanel()
}

watch(open, (v) => {
  if (v) emit('opened')
  else emit('closed')
})

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
})

defineExpose({ closePanel })
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      :id="triggerId"
      type="button"
      :class="triggerClass"
      :aria-expanded="open"
      :aria-invalid="hasError || undefined"
      :aria-describedby="hasError ? errorElId : undefined"
      aria-haspopup="listbox"
      :aria-controls="listboxIdResolved"
      @click.stop="toggle"
    >
      <span :class="displayLabel ? 'text-neutral-900' : 'text-neutral-400'">
        {{ displayLabel || placeholder }}
      </span>
      <ChevronDown
        class="size-4 shrink-0 text-neutral-400 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      />
    </button>

    <ul
      v-show="open"
      :id="listboxIdResolved"
      role="listbox"
      class="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-neutral-200 bg-white shadow-lg"
      @click.stop
    >
      <li v-for="row in rows" :key="row.value" role="presentation">
        <button
          type="button"
          role="option"
          class="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40"
          :class="
            model === row.value ? 'bg-blue-600 text-white hover:bg-blue-600' : ''
          "
          :aria-selected="model === row.value"
          @click="pick(row.value)"
        >
          {{ row.label }}
        </button>
      </li>
    </ul>
    <p
      v-if="hasError"
      :id="errorElId"
      role="alert"
      class="mt-1 max-w-full break-words text-xs text-red-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
