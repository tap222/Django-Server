<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: number
    /** Drives the orange arc fill from 0 (empty) to 100 (full). Out-of-range values are clamped. */
    percentage?: number
    change?: number
  }>(),
  {
    value: 80000,
    percentage: 80,
    change: -2,
  },
)

/** Matches SVG ring: outer 137.5, inner 123.75, thickness 13.75 (viewBox 0 0 275 218). */
const R_OUTER = 137.5
const RING_WIDTH = 13.75
const CENTER = 137.5
const strokeRadius = R_OUTER - RING_WIDTH / 2 // 130.625 — mid-annulus for stroked progress

/** Upper semicircle (west → east through north); sweep 0 = CCW in user space → top arc. */
const x0 = CENTER - strokeRadius
const x1 = CENTER + strokeRadius
const PROGRESS_ARC_PATH = `M ${x0} ${CENTER} A ${strokeRadius} ${strokeRadius} 0 0 1 ${x1} ${CENTER}`

const arcLength = Math.PI * strokeRadius

const clampedPct = computed(() =>
  Math.min(100, Math.max(0, Number.isFinite(props.percentage) ? props.percentage : 0)),
)
const dashOffset = computed(
  () => arcLength - (clampedPct.value / 100) * arcLength,
)

const uid = useId().replace(/:/g, '-')
const filterId = `filter0_d-${uid}`
const paintGradientId = `paint0_linear-${uid}`

const formattedValue = computed(() =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(props.value),
)

const changeSign = computed(() => (props.change > 0 ? '+' : ''))
const changePctClass = computed(() =>
  props.change < 0
    ? 'text-[#EF4444]'
    : props.change > 0
      ? 'text-green-600'
      : 'text-[#6B7280]',
)
const ariaLabel = computed(() => {
  const dir = props.change < 0 ? 'down' : props.change > 0 ? 'up' : 'unchanged'
  return `Income this month: ${formattedValue.value} (${clampedPct.value}% of goal), ${dir} ${Math.abs(props.change)}% from last month`
})
</script>

<template>
  <!--
    Parent section renders the "Income This Month" heading and card shell.
    Filled ring (design) + stroked semicircle progress driven by `percentage`.
  -->
  <div class="relative w-full @container" role="img" :aria-label="ariaLabel">
    <div class="flex w-full items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="mx-auto block h-auto w-full max-w-[275px] overflow-visible"
        width="100%"
        height="auto"
        viewBox="0 0 275 218"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter
            :id="filterId"
            x="-22"
            y="-14"
            width="319"
            height="319"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="8" />
            <feGaussianBlur stdDeviation="11" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.960784 0 0 0 0 0.490196 0 0 0 0 0.141176 0 0 0 0.1 0"
            />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_541" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_541" result="shape" />
          </filter>

          <linearGradient
            :id="paintGradientId"
            x1="137.5"
            y1="0"
            x2="137.5"
            y2="159.574"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F57D24" />
            <stop offset="1" stop-color="#F57D24" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Base filled ring (unchanged artwork) -->
        <g :filter="`url(#${filterId})`">
          <path
            d="M275 137.5C275 213.439 213.439 275 137.5 275C61.5608 275 0 213.439 0 137.5C0 61.5608 61.5608 0 137.5 0C213.439 0 275 61.5608 275 137.5ZM13.75 137.5C13.75 205.845 69.1548 261.25 137.5 261.25C205.845 261.25 261.25 205.845 261.25 137.5C261.25 69.1548 205.845 13.75 137.5 13.75C69.1548 13.75 13.75 69.1548 13.75 137.5Z"
            :fill="`url(#${paintGradientId})`"
            shape-rendering="crispEdges"
          />
        </g>

        <!-- Progress stroke (same gradient + glow); dash reveals 0–100% along top semicircle -->
        <g :filter="`url(#${filterId})`">
          <path
            class="income-semicircle-progress"
            :d="PROGRESS_ARC_PATH"
            fill="none"
            :stroke="`url(#${paintGradientId})`"
            stroke-width="13.75"
            stroke-linecap="round"
            :stroke-dasharray="arcLength"
            :stroke-dashoffset="dashOffset"
          />
        </g>
      </svg>
    </div>

    <div
      class="pointer-events-none absolute inset-0 flex flex-col items-center"
      style="padding-top: 15%"
      aria-hidden="true"
    >
      <div class="flex size-[55px] shrink-0 items-center justify-center rounded-[14px] bg-[#FFF2E7]">
        <img
          src="/images/income-dollar-icon.png"
          alt=""
          width="30"
          height="30"
          class="size-[30px] object-contain"
          aria-hidden="true"
        />
      </div>

      <div class="h-2.5 shrink-0" />

      <p
        class="mt-5 text-center font-bold leading-none tracking-wide text-[#FF8A00]"
        style="font-size: clamp(1rem, 5cqw, 2.5rem);"
      >
        {{ formattedValue }}
      </p>

      <p class="mt-1.5 text-center text-[13px] leading-snug">
        <span class="font-semibold" :class="changePctClass">
          {{ changeSign }}{{ props.change }}%
        </span>
        <span class="font-normal text-[#6B7280]"> than last month</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.income-semicircle-progress {
  transition: stroke-dashoffset 0.8s ease;
}

@media (prefers-reduced-motion: reduce) {
  .income-semicircle-progress {
    transition: none;
  }
}
</style>
