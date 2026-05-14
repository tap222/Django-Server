<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { Calendar, ChevronDown, ChevronUp } from 'lucide-vue-next'
import {
  MONTH_NAMES,
  WEEKDAYS,
  buildMonthGrid,
  dateOnlyCompare,
  formatDisplayDdMmYyyy,
  isDateDisabled,
  parseIsoDate,
  sameDay,
  toIsoDate,
} from '@/components/common/datePickerCalendar'

const startModel = defineModel<string>('start', { default: '' })
const endModel = defineModel<string>('end', { default: '' })

const props = withDefaults(
  defineProps<{
    startLabel?: string
    endLabel?: string
    startId?: string
    endId?: string
    min?: string
    max?: string
    /** Inline validation message under start trigger */
    errorStart?: string
    /** Inline validation message under end trigger */
    errorEnd?: string
  }>(),
  {
    startLabel: 'Start date:',
    endLabel: 'End date:',
  },
)

const uid = useId()
const startFieldId = computed(() => props.startId ?? `drp-start-${uid}`)
const endFieldId = computed(() => props.endId ?? `drp-end-${uid}`)
const startYearMenuPanelId = computed(() => `${startFieldId.value}-year-menu`)
const endYearMenuPanelId = computed(() => `${endFieldId.value}-year-menu`)

const today = new Date()
const rootRef = ref<HTMLElement | null>(null)

const openWhich = ref<'start' | 'end' | null>(null)
const startYearMenuOpen = ref(false)
const endYearMenuOpen = ref(false)
const startYearTriggerRef = ref<HTMLButtonElement | null>(null)
const endYearTriggerRef = ref<HTMLButtonElement | null>(null)
const startYearMenuRef = ref<HTMLElement | null>(null)
const endYearMenuRef = ref<HTMLElement | null>(null)
const startYearSelectRef = ref<HTMLSelectElement | null>(null)
const endYearSelectRef = ref<HTMLSelectElement | null>(null)

const startViewYear = ref(today.getFullYear())
const startViewMonth = ref(today.getMonth())
const endViewYear = ref(today.getFullYear())
const endViewMonth = ref(today.getMonth())

const startDate = computed(() => parseIsoDate(startModel.value))
const endDate = computed(() => parseIsoDate(endModel.value))

function syncStartView() {
  const dt = startDate.value
  if (dt) {
    startViewYear.value = dt.getFullYear()
    startViewMonth.value = dt.getMonth()
  }
}

function syncEndView() {
  const dt = endDate.value
  if (dt) {
    endViewYear.value = dt.getFullYear()
    endViewMonth.value = dt.getMonth()
  }
}

function openStart() {
  syncStartView()
  startYearMenuOpen.value = false
  endYearMenuOpen.value = false
  openWhich.value = 'start'
}

function openEnd() {
  syncEndView()
  startYearMenuOpen.value = false
  endYearMenuOpen.value = false
  openWhich.value = 'end'
}

function toggleStart() {
  if (openWhich.value === 'start') {
    openWhich.value = null
  }
  else {
    openStart()
  }
}

function toggleEnd() {
  if (openWhich.value === 'end') {
    openWhich.value = null
  }
  else {
    openEnd()
  }
}

function closePanels() {
  openWhich.value = null
  startYearMenuOpen.value = false
  endYearMenuOpen.value = false
}

function buildYearList(viewY: number, sel: Date | null): number[] {
  const t = today.getFullYear()
  let start = t - 120
  let end = t + 20
  const minD = props.min ? parseIsoDate(props.min) : null
  const maxD = props.max ? parseIsoDate(props.max) : null
  if (minD) start = minD.getFullYear()
  if (maxD) end = maxD.getFullYear()
  if (sel) {
    start = Math.min(start, sel.getFullYear())
    end = Math.max(end, sel.getFullYear())
  }
  start = Math.min(start, viewY)
  end = Math.max(end, viewY)
  if (start > end) {
    const swap = start
    start = end
    end = swap
  }
  const years: number[] = []
  for (let y = start; y <= end; y++) years.push(y)
  return years
}

const startYearOptions = computed(() =>
  buildYearList(startViewYear.value, startDate.value),
)
const endYearOptions = computed(() =>
  buildYearList(endViewYear.value, endDate.value),
)

function toggleYearMenu(which: 'start' | 'end') {
  if (which === 'start') {
    endYearMenuOpen.value = false
    startYearMenuOpen.value = !startYearMenuOpen.value
  }
  else {
    startYearMenuOpen.value = false
    endYearMenuOpen.value = !endYearMenuOpen.value
  }
}

function onYearMenuSelect(which: 'start' | 'end', ev: Event) {
  const el = ev.target as HTMLSelectElement
  const y = Number(el.value)
  if (which === 'start') {
    startViewYear.value = y
    startYearMenuOpen.value = false
    nextTick(() => startYearTriggerRef.value?.focus())
  }
  else {
    endViewYear.value = y
    endYearMenuOpen.value = false
    nextTick(() => endYearTriggerRef.value?.focus())
  }
}

function onYearSelectKeydown(which: 'start' | 'end', ev: KeyboardEvent) {
  if (ev.key !== 'Escape') return
  if (which === 'start') {
    startYearMenuOpen.value = false
    nextTick(() => startYearTriggerRef.value?.focus())
  }
  else {
    endYearMenuOpen.value = false
    nextTick(() => endYearTriggerRef.value?.focus())
  }
  ev.preventDefault()
}

function navMonth(which: 'start' | 'end', dir: number) {
  startYearMenuOpen.value = false
  endYearMenuOpen.value = false
  if (which === 'start') {
    let m = startViewMonth.value + dir
    let y = startViewYear.value
    if (m > 11) {
      m = 0
      y++
    }
    if (m < 0) {
      m = 11
      y--
    }
    startViewMonth.value = m
    startViewYear.value = y
  }
  else {
    let m = endViewMonth.value + dir
    let y = endViewYear.value
    if (m > 11) {
      m = 0
      y++
    }
    if (m < 0) {
      m = 11
      y--
    }
    endViewMonth.value = m
    endViewYear.value = y
  }
}

const startGrid = computed(() =>
  buildMonthGrid(startViewYear.value, startViewMonth.value),
)
const endGrid = computed(() =>
  buildMonthGrid(endViewYear.value, endViewMonth.value),
)

function pickDay(d: Date, which: 'start' | 'end') {
  if (isDateDisabled(d, props.min, props.max)) return

  if (which === 'start') {
    startModel.value = toIsoDate(d)
    if (endDate.value && dateOnlyCompare(d, endDate.value) > 0) {
      endModel.value = ''
    }
    openEnd()
  }
  else {
    const s = startDate.value
    if (s && dateOnlyCompare(d, s) < 0) {
      startModel.value = toIsoDate(d)
      endModel.value = ''
    }
    else {
      endModel.value = toIsoDate(d)
    }
    openWhich.value = null
  }
}

function onClear() {
  startModel.value = ''
  endModel.value = ''
  closePanels()
}

function onToday(which: 'start' | 'end') {
  startYearMenuOpen.value = false
  endYearMenuOpen.value = false
  const t = new Date()
  if (which === 'start') {
    startViewYear.value = t.getFullYear()
    startViewMonth.value = t.getMonth()
  }
  else {
    endViewYear.value = t.getFullYear()
    endViewMonth.value = t.getMonth()
  }
}

function triggerClass(which: 'start' | 'end') {
  const base =
    'flex h-11 w-full cursor-pointer items-center gap-2 rounded-md border-[0.5px] border-neutral-200 bg-white px-3 text-sm transition-colors'
  const active = openWhich.value === which
  const invalid = which === 'start' ? !!props.errorStart : !!props.errorEnd
  if (active) {
    return `${base} border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]${invalid ? ' ring-2 ring-red-500/20' : ''}`
  }
  if (invalid) {
    return `${base} border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] hover:border-red-600 focus-visible:border-red-600 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(239,68,68,0.15)]`
  }
  return `${base} hover:border-orange-500 focus-visible:border-orange-500 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(249,115,22,0.15)]`
}

function rangeDayClass(
  d: Date,
  inCurrentMonth: boolean,
): string {
  const disabled = isDateDisabled(d, props.min, props.max)
  const s = startDate.value
  const e = endDate.value

  const isSameStart = s ? sameDay(d, s) : false
  const isSameEnd = e ? sameDay(d, e) : false
  const isToday = sameDay(d, today)

  const sameSpan = !!(s && e && sameDay(s, e))
  const hasRange = !!(s && e && !sameDay(s, e))
  const startOnly = !!(s && !e && isSameStart)
  const inRange = !!(s && e && dateOnlyCompare(d, s) > 0 && dateOnlyCompare(d, e) < 0)

  const parts: string[] = [
    'flex h-[34px] items-center justify-center text-[13px] transition-colors',
  ]

  if (!inCurrentMonth) {
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

  if (sameSpan && isSameStart && isSameEnd) {
    parts.push('rounded-md bg-orange-500 font-medium text-white')
  }
  else if (startOnly) {
    parts.push('rounded-md bg-orange-500 font-medium text-white')
  }
  else if (hasRange && isSameStart) {
    parts.push(
      'rounded-l-md rounded-r-none bg-orange-500 font-medium text-white',
    )
  }
  else if (hasRange && isSameEnd) {
    parts.push(
      'rounded-r-md rounded-l-none bg-orange-500 font-medium text-white',
    )
  }
  else if (inRange) {
    parts.push('rounded-none bg-orange-500/10 font-normal')
  }
  else if (isToday && !isSameStart && !isSameEnd) {
    parts.push('rounded-md font-medium text-orange-500')
  }
  else {
    parts.push('rounded-md')
  }

  const filledOrange =
    (sameSpan && isSameStart && isSameEnd)
    || startOnly
    || (hasRange && isSameStart)
    || (hasRange && isSameEnd)

  if (
    !disabled
    && !inRange
    && !filledOrange
    && !(isToday && !isSameStart && !isSameEnd)
  ) {
    parts.push('hover:bg-neutral-100')
  }

  return parts.join(' ')
}

const startDisplay = computed(() => {
  const dt = startDate.value
  return dt ? formatDisplayDdMmYyyy(dt) : ''
})
const endDisplay = computed(() => {
  const dt = endDate.value
  return dt ? formatDisplayDdMmYyyy(dt) : ''
})

function onDocumentPointerDown(ev: MouseEvent | PointerEvent) {
  const t = ev.target as Node
  if (openWhich.value === 'start' && startYearMenuOpen.value) {
    if (
      !startYearMenuRef.value?.contains(t)
      && !startYearTriggerRef.value?.contains(t)
    ) {
      startYearMenuOpen.value = false
    }
  }
  if (openWhich.value === 'end' && endYearMenuOpen.value) {
    if (
      !endYearMenuRef.value?.contains(t)
      && !endYearTriggerRef.value?.contains(t)
    ) {
      endYearMenuOpen.value = false
    }
  }
  if (rootRef.value?.contains(t)) return
  closePanels()
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key !== 'Escape') return
  if (openWhich.value === 'start' && startYearMenuOpen.value) {
    startYearMenuOpen.value = false
    nextTick(() => startYearTriggerRef.value?.focus())
    return
  }
  if (openWhich.value === 'end' && endYearMenuOpen.value) {
    endYearMenuOpen.value = false
    nextTick(() => endYearTriggerRef.value?.focus())
    return
  }
  closePanels()
}

watch(openWhich, () => {
  startYearMenuOpen.value = false
  endYearMenuOpen.value = false
})

watch(startYearMenuOpen, async (v) => {
  if (!v || openWhich.value !== 'start') return
  await nextTick()
  startYearSelectRef.value?.showPicker?.()
  startYearSelectRef.value?.focus()
})

watch(endYearMenuOpen, async (v) => {
  if (!v || openWhich.value !== 'end') return
  await nextTick()
  endYearSelectRef.value?.showPicker?.()
  endYearSelectRef.value?.focus()
})

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="rootRef" class="flex flex-wrap items-start gap-6">
    <!-- Start -->
    <div class="min-w-[200px] flex-1">
      <label
        class="mb-1.5 block cursor-default text-[13px] text-neutral-500"
        :for="startFieldId"
      >{{ startLabel }}</label>
      <div class="relative">
        <button
          :id="startFieldId"
          type="button"
          :class="triggerClass('start')"
          aria-haspopup="dialog"
          :aria-expanded="openWhich === 'start'"
          :aria-invalid="errorStart ? true : undefined"
          :aria-describedby="errorStart ? `${startFieldId}-error` : undefined"
          @click.stop="toggleStart"
        >
          <span
            class="min-w-0 flex-1 truncate text-left text-sm"
            :class="startDisplay ? 'text-neutral-900' : 'text-neutral-400'"
          >
            {{ startDisplay || 'DD-MM-YYYY' }}
          </span>
          <Calendar class="size-4 shrink-0 text-neutral-500" aria-hidden="true" />
        </button>

        <div
          v-show="openWhich === 'start'"
          role="dialog"
          aria-label="Choose start date"
          class="absolute left-0 z-50 mt-1 w-[270px] overflow-visible rounded-lg border-[0.5px] border-neutral-200 bg-white p-3"
          @click.stop
        >
          <div class="mb-2.5 flex min-h-[31px] items-center justify-between">
            <div class="relative min-w-0 flex-1 pr-1">
              <div class="flex min-w-0 items-center gap-0.5 text-sm font-medium text-neutral-900">
                <span class="truncate">{{ MONTH_NAMES[startViewMonth] }},</span>
                <button
                  ref="startYearTriggerRef"
                  type="button"
                  class="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/25"
                  :aria-label="`Choose start year (${MONTH_NAMES[startViewMonth]} ${startViewYear})`"
                  aria-haspopup="listbox"
                  :aria-expanded="startYearMenuOpen"
                  :aria-controls="startYearMenuPanelId"
                  @click.stop="toggleYearMenu('start')"
                >
                  {{ startViewYear }}
                  <ChevronDown
                    class="size-[13px] shrink-0 text-neutral-600 transition-transform duration-150 ease-out"
                    :class="startYearMenuOpen ? 'rotate-180' : ''"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <Transition name="drp-year-pop">
                <div
                  v-if="startYearMenuOpen"
                  :id="startYearMenuPanelId"
                  ref="startYearMenuRef"
                  class="absolute left-0 top-full z-[60] mt-0.5 w-[5.75rem] overflow-hidden rounded-md border-[0.5px] border-neutral-200 bg-white py-0.5 shadow-md"
                  @click.stop
                >
                  <label class="sr-only" :for="`${startFieldId}-year-list`">Start year</label>
                  <select
                    :id="`${startFieldId}-year-list`"
                    ref="startYearSelectRef"
                    size="10"
                    class="block max-h-[min(40vh,220px)] w-full cursor-pointer border-0 bg-transparent py-0.5 pl-2 pr-1 text-sm text-neutral-900 focus:outline-none focus:ring-0"
                    :value="startViewYear"
                    @change="onYearMenuSelect('start', $event)"
                    @keydown="onYearSelectKeydown('start', $event)"
                  >
                    <option
                      v-for="y in startYearOptions"
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
                @click="navMonth('start', -1)"
              >
                <ChevronUp class="size-[15px]" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="flex size-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Next month"
                @click="navMonth('start', 1)"
              >
                <ChevronDown class="size-[15px]" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-0.5">
            <div
              v-for="w in WEEKDAYS"
              :key="`sw-${w}`"
              class="py-1 pb-1.5 text-center text-[11px] text-neutral-400"
            >
              {{ w }}
            </div>
            <button
              v-for="(cell, idx) in startGrid"
              :key="`sc-${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}-${idx}`"
              type="button"
              :disabled="isDateDisabled(cell.date, min, max)"
              :class="rangeDayClass(cell.date, cell.inCurrentMonth)"
              @click="pickDay(cell.date, 'start')"
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
              @click="onToday('start')"
            >
              Today
            </button>
          </div>
        </div>
      </div>
      <p
        v-if="errorStart"
        :id="`${startFieldId}-error`"
        role="alert"
        class="mt-1 min-h-[1.25rem] max-w-full break-words text-xs text-red-600"
      >
        {{ errorStart }}
      </p>
    </div>

    <!-- End -->
    <div class="min-w-[200px] flex-1">
      <label
        class="mb-1.5 block cursor-default text-[13px] text-neutral-500"
        :for="endFieldId"
      >{{ endLabel }}</label>
      <div class="relative">
        <button
          :id="endFieldId"
          type="button"
          :class="triggerClass('end')"
          aria-haspopup="dialog"
          :aria-expanded="openWhich === 'end'"
          :aria-invalid="errorEnd ? true : undefined"
          :aria-describedby="errorEnd ? `${endFieldId}-error` : undefined"
          @click.stop="toggleEnd"
        >
          <span
            class="min-w-0 flex-1 truncate text-left text-sm"
            :class="endDisplay ? 'text-neutral-900' : 'text-neutral-400'"
          >
            {{ endDisplay || 'DD-MM-YYYY' }}
          </span>
          <Calendar class="size-4 shrink-0 text-neutral-500" aria-hidden="true" />
        </button>

        <div
          v-show="openWhich === 'end'"
          role="dialog"
          aria-label="Choose end date"
          class="absolute left-0 z-50 mt-1 w-[270px] overflow-visible rounded-lg border-[0.5px] border-neutral-200 bg-white p-3"
          @click.stop
        >
          <div class="mb-2.5 flex min-h-[31px] items-center justify-between">
            <div class="relative min-w-0 flex-1 pr-1">
              <div class="flex min-w-0 items-center gap-0.5 text-sm font-medium text-neutral-900">
                <span class="truncate">{{ MONTH_NAMES[endViewMonth] }},</span>
                <button
                  ref="endYearTriggerRef"
                  type="button"
                  class="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/25"
                  :aria-label="`Choose end year (${MONTH_NAMES[endViewMonth]} ${endViewYear})`"
                  aria-haspopup="listbox"
                  :aria-expanded="endYearMenuOpen"
                  :aria-controls="endYearMenuPanelId"
                  @click.stop="toggleYearMenu('end')"
                >
                  {{ endViewYear }}
                  <ChevronDown
                    class="size-[13px] shrink-0 text-neutral-600 transition-transform duration-150 ease-out"
                    :class="endYearMenuOpen ? 'rotate-180' : ''"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <Transition name="drp-year-pop">
                <div
                  v-if="endYearMenuOpen"
                  :id="endYearMenuPanelId"
                  ref="endYearMenuRef"
                  class="absolute left-0 top-full z-[60] mt-0.5 w-[5.75rem] overflow-hidden rounded-md border-[0.5px] border-neutral-200 bg-white py-0.5 shadow-md"
                  @click.stop
                >
                  <label class="sr-only" :for="`${endFieldId}-year-list`">End year</label>
                  <select
                    :id="`${endFieldId}-year-list`"
                    ref="endYearSelectRef"
                    size="10"
                    class="block max-h-[min(40vh,220px)] w-full cursor-pointer border-0 bg-transparent py-0.5 pl-2 pr-1 text-sm text-neutral-900 focus:outline-none focus:ring-0"
                    :value="endViewYear"
                    @change="onYearMenuSelect('end', $event)"
                    @keydown="onYearSelectKeydown('end', $event)"
                  >
                    <option
                      v-for="y in endYearOptions"
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
                @click="navMonth('end', -1)"
              >
                <ChevronUp class="size-[15px]" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="flex size-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Next month"
                @click="navMonth('end', 1)"
              >
                <ChevronDown class="size-[15px]" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-7 gap-0.5">
            <div
              v-for="w in WEEKDAYS"
              :key="`ew-${w}`"
              class="py-1 pb-1.5 text-center text-[11px] text-neutral-400"
            >
              {{ w }}
            </div>
            <button
              v-for="(cell, idx) in endGrid"
              :key="`ec-${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}-${idx}`"
              type="button"
              :disabled="isDateDisabled(cell.date, min, max)"
              :class="rangeDayClass(cell.date, cell.inCurrentMonth)"
              @click="pickDay(cell.date, 'end')"
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
              @click="onToday('end')"
            >
              Today
            </button>
          </div>
        </div>
      </div>
      <p
        v-if="errorEnd"
        :id="`${endFieldId}-error`"
        role="alert"
        class="mt-1 min-h-[1.25rem] max-w-full break-words text-xs text-red-600"
      >
        {{ errorEnd }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.drp-year-pop-enter-active,
.drp-year-pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.drp-year-pop-enter-from,
.drp-year-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
