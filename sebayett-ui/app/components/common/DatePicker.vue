<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { Calendar, ChevronDown, ChevronUp } from 'lucide-vue-next'
import {
  MONTH_NAMES,
  WEEKDAYS,
  buildMonthGrid,
  formatDisplayDdMmYyyy,
  isDateDisabled,
  parseIsoDate,
  sameDay,
  toIsoDate,
} from '@/components/common/datePickerCalendar'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    /** Trigger id for label association and aria-controls */
    buttonId?: string
    placeholder?: string
    disabled?: boolean
    min?: string
    max?: string
    invalid?: boolean
    /** Element id(s) for aria-describedby (e.g. error message id) */
    ariaDescribedby?: string
  }>(),
  {
    placeholder: 'DD-MM-YYYY',
    disabled: false,
    invalid: false,
  },
)

const emit = defineEmits<{
  opened: []
  closed: []
}>()

const uid = useId()
const triggerId = computed(() => props.buttonId ?? `dp-${uid}`)
const panelId = computed(() => `${triggerId.value}-panel`)
const yearMenuPanelId = computed(() => `${triggerId.value}-year-menu`)

const today = new Date()
const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const yearMenuOpen = ref(false)
const yearTriggerRef = ref<HTMLButtonElement | null>(null)
const yearMenuRef = ref<HTMLElement | null>(null)
const yearSelectRef = ref<HTMLSelectElement | null>(null)

const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

const selectedDate = computed(() => parseIsoDate(model.value))

const yearOptions = computed(() => {
  const t = today.getFullYear()
  let start = t - 120
  let end = t + 20
  const minD = props.min ? parseIsoDate(props.min) : null
  const maxD = props.max ? parseIsoDate(props.max) : null
  if (minD) start = minD.getFullYear()
  if (maxD) end = maxD.getFullYear()
  const vy = viewYear.value
  const sel = selectedDate.value
  if (sel) {
    start = Math.min(start, sel.getFullYear())
    end = Math.max(end, sel.getFullYear())
  }
  start = Math.min(start, vy)
  end = Math.max(end, vy)
  if (start > end) {
    const swap = start
    start = end
    end = swap
  }
  const years: number[] = []
  for (let y = start; y <= end; y++) years.push(y)
  return years
})

function syncViewToSelection() {
  const dt = selectedDate.value
  if (dt) {
    viewYear.value = dt.getFullYear()
    viewMonth.value = dt.getMonth()
  }
}

function togglePanel() {
  if (props.disabled) return
  if (open.value) {
    open.value = false
  }
  else {
    syncViewToSelection()
    yearMenuOpen.value = false
    open.value = true
  }
}

function closePanel() {
  open.value = false
  yearMenuOpen.value = false
}

function toggleYearMenu() {
  yearMenuOpen.value = !yearMenuOpen.value
}

function onYearMenuSelect(ev: Event) {
  const el = ev.target as HTMLSelectElement
  viewYear.value = Number(el.value)
  yearMenuOpen.value = false
  nextTick(() => {
    yearTriggerRef.value?.focus()
  })
}

function onYearSelectKeydown(ev: KeyboardEvent) {
  if (ev.key !== 'Escape') return
  yearMenuOpen.value = false
  ev.preventDefault()
  nextTick(() => {
    yearTriggerRef.value?.focus()
  })
}

function navMonth(dir: number) {
  yearMenuOpen.value = false
  let m = viewMonth.value + dir
  let y = viewYear.value
  if (m > 11) {
    m = 0
    y++
  }
  if (m < 0) {
    m = 11
    y--
  }
  viewMonth.value = m
  viewYear.value = y
}

const gridCells = computed(() =>
  buildMonthGrid(viewYear.value, viewMonth.value),
)

function selectDay(date: Date) {
  if (isDateDisabled(date, props.min, props.max)) return
  model.value = toIsoDate(date)
  closePanel()
}

function onClear() {
  model.value = ''
}

function onTodayView() {
  yearMenuOpen.value = false
  const t = new Date()
  viewYear.value = t.getFullYear()
  viewMonth.value = t.getMonth()
}

const displayText = computed(() => {
  const dt = selectedDate.value
  if (!dt) return ''
  return formatDisplayDdMmYyyy(dt)
})

const triggerClass = computed(() => {
  const base =
    'flex h-11 w-full cursor-pointer items-center gap-2 rounded-md border-[0.5px] border-neutral-200 bg-white px-3 text-sm transition-colors'
  if (props.disabled) {
    return `${base} cursor-not-allowed bg-neutral-50 text-neutral-400`
  }
  const invalidCls = props.invalid
    ? ' border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
    : ''
  if (open.value) {
    return `${base} border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]${props.invalid ? ' ring-2 ring-red-500/20' : ''}`
  }
  if (props.invalid) {
    return `${base}${invalidCls} hover:border-red-600 focus-visible:border-red-600 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(239,68,68,0.15)]`
  }
  return `${base} hover:border-orange-500 focus-visible:border-orange-500 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(249,115,22,0.15)]`
})

function dayCellClass(cell: { date: Date; inCurrentMonth: boolean }) {
  const d = cell.date
  const disabled = isDateDisabled(d, props.min, props.max)
  const isSel = selectedDate.value && sameDay(d, selectedDate.value)
  const isToday = sameDay(d, today)

  const parts: string[] = [
    'flex h-[34px] items-center justify-center rounded-md text-[13px] transition-colors',
  ]

  if (!cell.inCurrentMonth) {
    parts.push('text-neutral-400')
  }
  else {
    parts.push('text-neutral-900')
  }

  if (disabled) {
    parts.push('cursor-default opacity-40')
  }
  else {
    parts.push('cursor-pointer')
  }

  if (isSel) {
    parts.push('bg-orange-500 font-medium text-white')
  }
  else if (isToday) {
    parts.push('font-medium text-orange-500')
  }

  if (!disabled && !isSel && !isToday) {
    parts.push('hover:bg-neutral-100')
  }

  return parts.join(' ')
}

function onDocumentPointerDown(ev: MouseEvent | PointerEvent) {
  const t = ev.target as Node
  if (open.value && yearMenuOpen.value) {
    if (
      !yearMenuRef.value?.contains(t)
      && !yearTriggerRef.value?.contains(t)
    ) {
      yearMenuOpen.value = false
    }
  }
  if (rootRef.value?.contains(t)) return
  closePanel()
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key !== 'Escape') return
  if (yearMenuOpen.value) {
    yearMenuOpen.value = false
    nextTick(() => {
      yearTriggerRef.value?.focus()
    })
    return
  }
  closePanel()
}

watch(open, (v) => {
  if (v) {
    emit('opened')
  }
  else {
    yearMenuOpen.value = false
    emit('closed')
  }
})

watch(yearMenuOpen, async (v) => {
  if (!v) return
  await nextTick()
  yearSelectRef.value?.focus()
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
  <div ref="rootRef" class="relative w-full">
    <button
      :id="triggerId"
      type="button"
      :class="triggerClass"
      :disabled="disabled"
      :aria-expanded="open"
      :aria-invalid="invalid || undefined"
      :aria-describedby="ariaDescribedby || undefined"
      aria-haspopup="dialog"
      :aria-controls="panelId"
      @click.stop="togglePanel"
    >
      <span
        class="min-w-0 flex-1 truncate text-left text-sm"
        :class="displayText ? 'text-neutral-900' : 'text-neutral-400'"
      >
        {{ displayText || placeholder }}
      </span>
      <Calendar
        class="size-4 shrink-0 text-neutral-500"
        :stroke-width="1.75"
        aria-hidden="true"
      />
    </button>

    <div
      v-show="open"
      :id="panelId"
      role="dialog"
      aria-label="Choose date"
      class="absolute z-50 mt-1 w-[270px] overflow-visible rounded-lg border-[0.5px] border-neutral-200 bg-white p-3"
      @click.stop
    >
      <div class="mb-2.5 flex min-h-[31px] items-center justify-between">
        <div class="relative min-w-0 flex-1 pr-1">
          <div class="flex min-w-0 items-center gap-0.5 text-sm font-medium text-neutral-900">
            <span class="truncate">{{ MONTH_NAMES[viewMonth] }},</span>
            <button
              ref="yearTriggerRef"
              type="button"
              class="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/25"
              :aria-label="`Choose year (${MONTH_NAMES[viewMonth]} ${viewYear})`"
              aria-haspopup="listbox"
              :aria-expanded="yearMenuOpen"
              :aria-controls="yearMenuPanelId"
              @click.stop="toggleYearMenu"
            >
              {{ viewYear }}
              <ChevronDown
                class="size-[13px] shrink-0 text-neutral-600 transition-transform duration-150 ease-out"
                :class="yearMenuOpen ? 'rotate-180' : ''"
                aria-hidden="true"
              />
            </button>
          </div>
          <Transition name="dp-year-pop">
            <div
              v-if="yearMenuOpen"
              :id="yearMenuPanelId"
              ref="yearMenuRef"
              class="absolute left-0 top-full z-[60] mt-0.5 w-[5.75rem] overflow-hidden rounded-md border-[0.5px] border-neutral-200 bg-white py-0.5 shadow-md"
              @click.stop
            >
              <label class="sr-only" :for="`${triggerId}-year-list`">Year</label>
              <select
                :id="`${triggerId}-year-list`"
                ref="yearSelectRef"
                size="10"
                class="block max-h-[min(40vh,220px)] w-full cursor-pointer border-0 bg-transparent py-0.5 pl-2 pr-1 text-sm text-neutral-900 focus:outline-none focus:ring-0"
                :value="viewYear"
                @change="onYearMenuSelect"
                @keydown="onYearSelectKeydown"
              >
                <option
                  v-for="y in yearOptions"
                  :key="y"
                  :value="y"
                >
                  {{ y }}
                </option>
              </select>
            </div>
          </Transition>
        </div>
        <div class="flex shrink-0 gap-0.5">
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Previous month"
            @click="navMonth(-1)"
          >
            <ChevronUp class="size-[15px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Next month"
            @click="navMonth(1)"
          >
            <ChevronDown class="size-[15px]" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-0.5">
        <div
          v-for="w in WEEKDAYS"
          :key="w"
          class="py-1 pb-1.5 text-center text-[11px] text-neutral-400"
        >
          {{ w }}
        </div>
        <button
          v-for="(cell, idx) in gridCells"
          :key="`${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}-${idx}`"
          type="button"
          :disabled="isDateDisabled(cell.date, min, max)"
          :class="dayCellClass(cell)"
          @click="selectDay(cell.date)"
        >
          {{ cell.date.getDate() }}
        </button>
      </div>

      <div
        class="mt-2.5 flex items-center justify-between border-t border-[0.5px] border-neutral-200 pt-2"
      >
        <button
          type="button"
          class="rounded-md px-2 py-1 text-[13px] text-neutral-500 hover:bg-neutral-100"
          @click="onClear"
        >
          Clear
        </button>
        <button
          type="button"
          class="rounded-md px-2 py-1 text-[13px] font-medium text-orange-500 hover:bg-orange-500/10"
          @click="onTodayView"
        >
          Today
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dp-year-pop-enter-active,
.dp-year-pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.dp-year-pop-enter-from,
.dp-year-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
