<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
} from 'vue'
import { Clock } from 'lucide-vue-next'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    /** Optional id for label for= and aria-controls */
    triggerId?: string
    placeholder?: string
    disabled?: boolean
    /** When false, use 24-hour display without AM or PM */
    hour12?: boolean
    invalid?: boolean
    ariaDescribedby?: string
  }>(),
  {
    placeholder: '----',
    disabled: false,
    hour12: true,
    invalid: false,
  },
)

const emit = defineEmits<{
  opened: []
  closed: []
}>()

/** Scroll wheel geometry (px) */
const ITEM = 32
const VIEWPORT = 96
const SPACER = (VIEWPORT - ITEM) / 2

const uid = useId()
const resolvedTriggerId = computed(() => props.triggerId ?? `tp-${uid}`)
const panelId = computed(() => `${resolvedTriggerId.value}-panel`)

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const hourScrollRef = ref<HTMLDivElement | null>(null)
const minuteScrollRef = ref<HTMLDivElement | null>(null)
const apScrollRef = ref<HTMLDivElement | null>(null)

const open = ref(false)
const popupStyle = ref({ top: '0px', left: '0px' })

const hours12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const
const hours24 = Array.from({ length: 24 }, (_, i) => i)
const minutesStep = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const
const AMPM_REPEAT = 24
const ampmLabels = computed((): ('AM' | 'PM')[] =>
  Array.from({ length: AMPM_REPEAT * 2 }, (_, i) =>
    i % 2 === 0 ? 'AM' : 'PM',
  ),
)

/** 12h: 1 to 12. 24h: 0 to 23 */
const hVal = ref(12)
const mVal = ref(0)
const ap = ref<'AM' | 'PM'>('AM')

function snapMinute(m: number) {
  return (Math.round(m / 5) * 5 + 60) % 60
}

function parseModelToState() {
  const raw = model.value?.trim() ?? ''
  if (!raw) {
    hVal.value = 12
    mVal.value = 0
    ap.value = 'AM'
    return
  }

  if (props.hour12) {
    const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (match?.[1] && match[2] && match[3]) {
      const h = Number.parseInt(match[1], 10)
      const mi = Number.parseInt(match[2], 10)
      const mer = match[3].toUpperCase() as 'AM' | 'PM'
      if (h >= 1 && h <= 12 && mi >= 0 && mi <= 59) {
        hVal.value = h
        mVal.value = snapMinute(mi)
        ap.value = mer === 'PM' ? 'PM' : 'AM'
        return
      }
    }
  }
  else {
    const match24 = raw.match(/^(\d{1,2}):(\d{2})$/)
    if (match24?.[1] && match24[2]) {
      const h = Number.parseInt(match24[1], 10)
      const mi = Number.parseInt(match24[2], 10)
      if (h >= 0 && h <= 23 && mi >= 0 && mi <= 59) {
        hVal.value = h
        mVal.value = snapMinute(mi)
        return
      }
    }
  }

  hVal.value = 12
  mVal.value = 0
  ap.value = 'AM'
}

function formatModel(): string {
  const mm = String(mVal.value).padStart(2, '0')
  if (props.hour12) {
    const hh = String(hVal.value).padStart(2, '0')
    return `${hh}:${mm} ${ap.value}`
  }
  const hh = String(hVal.value).padStart(2, '0')
  return `${hh}:${mm}`
}

function syncToModel() {
  model.value = formatModel()
}

function hourIndex12(): number {
  const i = hours12.indexOf(hVal.value as (typeof hours12)[number])
  return i < 0 ? 0 : i
}

function hourIndex24(): number {
  return Math.min(23, Math.max(0, hVal.value))
}

function minuteIndex(): number {
  const i = minutesStep.indexOf(mVal.value as (typeof minutesStep)[number])
  return i < 0 ? 0 : i
}

/** Scroll index near middle of AM/PM strip so user can scroll both ways */
function apStartScrollIndex(): number {
  return ap.value === 'PM' ? AMPM_REPEAT + 1 : AMPM_REPEAT
}

function scrollColumnToIndex(
  el: HTMLDivElement | null,
  index: number,
  maxIndex: number,
  behavior: ScrollBehavior = 'auto',
) {
  if (!el) return
  const clamped = Math.max(0, Math.min(index, maxIndex))
  const top = clamped * ITEM
  el.scrollTo({ top, behavior })
}

function syncAllScrollPositions(behavior: ScrollBehavior = 'auto') {
  nextTick(() => {
    requestAnimationFrame(() => {
      if (props.hour12) {
        const hi = hourIndex12()
        if (hi >= 0) scrollColumnToIndex(hourScrollRef.value, hi, hours12.length - 1, behavior)
      }
      else {
        scrollColumnToIndex(hourScrollRef.value, hourIndex24(), 23, behavior)
      }
      const mi = minuteIndex()
      if (mi >= 0) scrollColumnToIndex(minuteScrollRef.value, mi, minutesStep.length - 1, behavior)
      if (props.hour12) {
        scrollColumnToIndex(
          apScrollRef.value,
          apStartScrollIndex(),
          ampmLabels.value.length - 1,
          behavior,
        )
      }
    })
  })
}

function finalizeHourScroll() {
  const el = hourScrollRef.value
  if (!el) return
  const max = (props.hour12 ? hours12.length : 24) - 1
  let i = Math.round(el.scrollTop / ITEM)
  i = Math.max(0, Math.min(i, max))
  if (Math.abs(el.scrollTop - i * ITEM) > 0.5) {
    el.scrollTo({ top: i * ITEM, behavior: 'smooth' })
  }
  if (props.hour12) {
    const v = hours12[i]
    if (v !== undefined && hVal.value !== v) {
      hVal.value = v
      syncToModel()
    }
  }
  else if (hVal.value !== i) {
    hVal.value = i
    syncToModel()
  }
}

function finalizeMinuteScroll() {
  const el = minuteScrollRef.value
  if (!el) return
  const max = minutesStep.length - 1
  let i = Math.round(el.scrollTop / ITEM)
  i = Math.max(0, Math.min(i, max))
  if (Math.abs(el.scrollTop - i * ITEM) > 0.5) {
    el.scrollTo({ top: i * ITEM, behavior: 'smooth' })
  }
  const v = minutesStep[i]
  if (v === undefined) return
  if (mVal.value !== v) {
    mVal.value = v
    syncToModel()
  }
}

function finalizeApScroll() {
  const el = apScrollRef.value
  if (!el || !props.hour12) return
  const max = ampmLabels.value.length - 1
  let i = Math.round(el.scrollTop / ITEM)
  i = Math.max(0, Math.min(i, max))
  if (Math.abs(el.scrollTop - i * ITEM) > 0.5) {
    el.scrollTo({ top: i * ITEM, behavior: 'smooth' })
  }
  const next = ampmLabels.value[i] === 'PM' ? 'PM' : 'AM'
  if (ap.value !== next) {
    ap.value = next
    syncToModel()
  }
}

function queueFinalize(
  idleRef: { current: ReturnType<typeof setTimeout> | null },
  fn: () => void,
) {
  if (idleRef.current) clearTimeout(idleRef.current)
  idleRef.current = setTimeout(() => {
    idleRef.current = null
    fn()
  }, 140)
}

const idleH = { current: null as ReturnType<typeof setTimeout> | null }
const idleM = { current: null as ReturnType<typeof setTimeout> | null }
const idleAp = { current: null as ReturnType<typeof setTimeout> | null }

function onHourScroll() {
  queueFinalize(idleH, finalizeHourScroll)
}

function onMinuteScroll() {
  queueFinalize(idleM, finalizeMinuteScroll)
}

function onApScroll() {
  queueFinalize(idleAp, finalizeApScroll)
}

function onHourScrollEnd() {
  if (idleH.current) clearTimeout(idleH.current)
  idleH.current = null
  finalizeHourScroll()
}

function onMinuteScrollEnd() {
  if (idleM.current) clearTimeout(idleM.current)
  idleM.current = null
  finalizeMinuteScroll()
}

function onApScrollEnd() {
  if (idleAp.current) clearTimeout(idleAp.current)
  idleAp.current = null
  finalizeApScroll()
}

const triggerDisplay = computed(() => {
  if (!model.value?.trim()) return props.placeholder
  return model.value
})

const triggerClass = computed(() => {
  const base =
    'flex h-11 w-full cursor-pointer items-center gap-2 rounded-md border-[0.5px] border-neutral-200 bg-white px-3 text-sm transition-colors'
  if (props.disabled) {
    return `${base} cursor-not-allowed bg-neutral-50 text-neutral-400`
  }
  if (open.value) {
    return `${base} border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]${props.invalid ? ' ring-2 ring-red-500/20' : ''}`
  }
  if (props.invalid) {
    return `${base} border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] hover:border-red-600 focus-visible:border-red-600 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(239,68,68,0.15)]`
  }
  return `${base} hover:border-orange-500 focus-visible:border-orange-500 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(249,115,22,0.15)]`
})

function updatePopupPosition() {
  const trig = triggerRef.value
  const pan = panelRef.value
  if (!trig || !pan) return
  const r = trig.getBoundingClientRect()
  const pad = 4
  const pw = pan.offsetWidth || 200
  let left = r.left + r.width / 2 - pw / 2
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8))
  let top = r.bottom + pad
  const ph = pan.offsetHeight || VIEWPORT + 48
  if (top + ph > window.innerHeight - 8) {
    top = Math.max(8, r.top - ph - pad)
  }
  popupStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

function openPanel() {
  if (props.disabled) return
  parseModelToState()
  open.value = true
  nextTick(() => {
    updatePopupPosition()
    syncAllScrollPositions('auto')
    requestAnimationFrame(() => updatePopupPosition())
  })
}

function closePanel() {
  open.value = false
}

function togglePanel() {
  if (open.value) closePanel()
  else openPanel()
}

function onDocumentPointerDown(ev: MouseEvent | PointerEvent) {
  const t = ev.target as Node
  if (rootRef.value?.contains(t)) return
  if (panelRef.value?.contains(t)) return
  closePanel()
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Escape') closePanel()
}

function onScrollOrResize() {
  if (open.value) updatePopupPosition()
}

watch(open, (v) => {
  if (v) {
    emit('opened')
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
  }
  else {
    emit('closed')
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
  }
})

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
  if (idleH.current) clearTimeout(idleH.current)
  if (idleM.current) clearTimeout(idleM.current)
  if (idleAp.current) clearTimeout(idleAp.current)
})

watch(
  () => model.value,
  () => {
    if (!open.value) return
    const beforeH = hVal.value
    const beforeM = mVal.value
    const beforeAp = ap.value
    parseModelToState()
    if (
      hVal.value !== beforeH
      || mVal.value !== beforeM
      || ap.value !== beforeAp
    ) {
      nextTick(() => syncAllScrollPositions('auto'))
    }
  },
)

watch(
  () => props.hour12,
  () => {
    if (open.value) {
      parseModelToState()
      nextTick(() => syncAllScrollPositions('auto'))
    }
  },
)

defineExpose({ closePanel })

function hourLabel(h: number) {
  return String(h).padStart(2, '0')
}

function minuteLabel(m: number) {
  return String(m).padStart(2, '0')
}

function isHourSelected(i: number) {
  if (props.hour12) return hours12[i] === hVal.value
  return i === hVal.value
}

function isMinuteSelected(i: number) {
  return minutesStep[i] === mVal.value
}

function isApSelected(i: number) {
  return ampmLabels.value[i] === ap.value
}
</script>

<template>
  <div ref="rootRef" class="relative w-full">
    <button
      :id="resolvedTriggerId"
      ref="triggerRef"
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
        class="min-w-0 flex-1 truncate text-left font-sans text-sm tabular-nums tracking-wide"
        :class="model?.trim() ? 'text-neutral-900' : 'text-neutral-400'"
      >
        {{ triggerDisplay }}
      </span>
      <Clock
        class="size-4 shrink-0 text-neutral-500"
        :stroke-width="1.75"
        aria-hidden="true"
      />
    </button>

    <Teleport to="body">
      <div
        v-show="open"
        :id="panelId"
        ref="panelRef"
        role="dialog"
        aria-label="Choose time"
        class="fixed z-[100] w-max min-w-[200px] rounded-lg border-[0.5px] border-neutral-200 bg-white px-4 py-3 font-sans shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        :style="popupStyle"
        @click.stop
      >
        <div class="flex flex-col items-center justify-center">
          <div class="flex items-center justify-center gap-1.5">
            <!-- Hours -->
            <div class="relative w-11 shrink-0 overflow-hidden rounded-md">
              <div
                class="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-8 -translate-y-1/2 rounded-md bg-neutral-100/95 ring-1 ring-inset ring-neutral-200/70"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-white via-white/90 to-transparent"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-white via-white/90 to-transparent"
                aria-hidden="true"
              />
              <div
                ref="hourScrollRef"
                role="listbox"
                aria-label="Hours"
                class="relative z-10 max-h-24 overflow-y-auto overflow-x-hidden scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-y snap-mandatory"
                :style="{ height: `${VIEWPORT}px`, scrollBehavior: 'smooth' }"
                @scroll="onHourScroll"
                @scrollend="onHourScrollEnd"
              >
                <div :style="{ height: `${SPACER}px` }" class="shrink-0" aria-hidden="true" />
                <template v-if="hour12">
                  <div
                    v-for="(h, i) in hours12"
                    :key="`h12-${h}`"
                    role="option"
                    :aria-selected="isHourSelected(i)"
                    class="flex h-8 shrink-0 cursor-default snap-center snap-always items-center justify-center font-sans text-sm font-medium tabular-nums text-neutral-800"
                    :class="isHourSelected(i) ? 'text-neutral-900' : 'text-neutral-400'"
                  >
                    {{ hourLabel(h) }}
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="(h, i) in hours24"
                    :key="`h24-${h}`"
                    role="option"
                    :aria-selected="isHourSelected(i)"
                    class="flex h-8 shrink-0 cursor-default snap-center snap-always items-center justify-center font-sans text-sm font-medium tabular-nums text-neutral-800"
                    :class="isHourSelected(i) ? 'text-neutral-900' : 'text-neutral-400'"
                  >
                    {{ hourLabel(h) }}
                  </div>
                </template>
                <div :style="{ height: `${SPACER}px` }" class="shrink-0" aria-hidden="true" />
              </div>
            </div>

            <span
              class="mb-0.5 self-center font-sans text-lg font-medium tabular-nums leading-none text-neutral-900"
            >:</span>

            <!-- Minutes -->
            <div class="relative w-11 shrink-0 overflow-hidden rounded-md">
              <div
                class="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-8 -translate-y-1/2 rounded-md bg-neutral-100/95 ring-1 ring-inset ring-neutral-200/70"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-white via-white/90 to-transparent"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-white via-white/90 to-transparent"
                aria-hidden="true"
              />
              <div
                ref="minuteScrollRef"
                role="listbox"
                aria-label="Minutes"
                class="relative z-10 max-h-24 overflow-y-auto overflow-x-hidden scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-y snap-mandatory"
                :style="{ height: `${VIEWPORT}px`, scrollBehavior: 'smooth' }"
                @scroll="onMinuteScroll"
                @scrollend="onMinuteScrollEnd"
              >
                <div :style="{ height: `${SPACER}px` }" class="shrink-0" aria-hidden="true" />
                <div
                  v-for="(m, i) in minutesStep"
                  :key="`m-${m}`"
                  role="option"
                  :aria-selected="isMinuteSelected(i)"
                  class="flex h-8 shrink-0 cursor-default snap-center snap-always items-center justify-center font-sans text-sm font-medium tabular-nums text-neutral-800"
                  :class="isMinuteSelected(i) ? 'text-neutral-900' : 'text-neutral-400'"
                >
                  {{ minuteLabel(m) }}
                </div>
                <div :style="{ height: `${SPACER}px` }" class="shrink-0" aria-hidden="true" />
              </div>
            </div>

            <!-- AM / PM -->
            <div
              v-if="hour12"
              class="relative ml-1 w-11 shrink-0 overflow-hidden rounded-md"
            >
              <div
                class="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-8 -translate-y-1/2 rounded-md bg-neutral-100/95 ring-1 ring-inset ring-neutral-200/70"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-white via-white/90 to-transparent"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-white via-white/90 to-transparent"
                aria-hidden="true"
              />
              <div
                ref="apScrollRef"
                role="listbox"
                aria-label="AM or PM"
                class="relative z-10 max-h-24 overflow-y-auto overflow-x-hidden scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-y snap-mandatory"
                :style="{ height: `${VIEWPORT}px`, scrollBehavior: 'smooth' }"
                @scroll="onApScroll"
                @scrollend="onApScrollEnd"
              >
                <div :style="{ height: `${SPACER}px` }" class="shrink-0" aria-hidden="true" />
                <div
                  v-for="(lab, i) in ampmLabels"
                  :key="`ap-${i}-${lab}`"
                  role="option"
                  :aria-selected="isApSelected(i)"
                  class="flex h-8 shrink-0 cursor-default snap-center snap-always items-center justify-center font-sans text-xs font-medium text-neutral-800"
                  :class="isApSelected(i) ? 'text-neutral-900' : 'text-neutral-400'"
                >
                  {{ lab }}
                </div>
                <div :style="{ height: `${SPACER}px` }" class="shrink-0" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
