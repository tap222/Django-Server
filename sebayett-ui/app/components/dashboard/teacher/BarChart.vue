<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
  type ScriptableContext,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { ChartComponentRef } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = withDefaults(defineProps<{ values?: number[] }>(), {
  values: () => [8, 12, 16, 20, 24, 18, 22, 14, 28, 16, 20, 24],
})

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const GRADIENT_TOP = '#FF9D42'
const GRADIENT_BOTTOM = '#F97316'
const HOVER_GRADIENT_TOP = '#FFB86A'
const HOVER_GRADIENT_BOTTOM = '#FB923C'

function verticalBarGradient(
  context: ScriptableContext<'bar'>,
  topColor: string,
  bottomColor: string,
): CanvasGradient | string {
  const { chart, dataIndex, datasetIndex } = context
  const { ctx, chartArea } = chart
  if (!chartArea) return bottomColor

  const meta = chart.getDatasetMeta(datasetIndex)
  const bar = meta.data[dataIndex]
  if (!bar) return bottomColor

  const props = bar.getProps(['x', 'y', 'base'], true) as {
    x: number
    y: number
    base: number
  }
  if (props.y === undefined || props.base === undefined) return bottomColor
  if (!Number.isFinite(props.x) || !Number.isFinite(props.y) || !Number.isFinite(props.base)) {
    return bottomColor
  }
  if (Math.abs(props.y - props.base) < 0.5) return bottomColor

  const gradient = ctx.createLinearGradient(props.x, props.y, props.x, props.base)
  gradient.addColorStop(0, topColor)
  gradient.addColorStop(1, bottomColor)
  return gradient
}

const data = computed<ChartData<'bar'>>(() => ({
  labels,
  datasets: [
    {
      data: props.values,
      borderRadius: 8,
      borderSkipped: 'start',
      borderWidth: 0,
      barPercentage: 0.72,
      categoryPercentage: 0.9,
      backgroundColor: (context) =>
        verticalBarGradient(context, GRADIENT_TOP, GRADIENT_BOTTOM),
      hoverBackgroundColor: (context) =>
        verticalBarGradient(context, HOVER_GRADIENT_TOP, HOVER_GRADIENT_BOTTOM),
      hoverBorderWidth: 0,
    },
  ],
}))

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750,
    easing: 'easeOutQuart',
  },
  layout: {
    padding: {
      left: 4,
      right: 12,
      top: 12,
      bottom: 4,
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      displayColors: false,
      caretSize: 0,
      caretPadding: 0,
      backgroundColor: '#FFFFFF',
      titleColor: '#1A1D23',
      bodyColor: '#1A1D23',
      borderColor: '#F3F4F6',
      borderWidth: 1,
      cornerRadius: 10,
      padding: { top: 10, right: 12, bottom: 10, left: 12 },
      titleFont: { size: 11, weight: 'normal' },
      bodyFont: { size: 13, weight: '500' },
      callbacks: {
        title: (items) => (items[0]?.label ? String(items[0].label) : ''),
        label: (context) => `${context.raw} Lessons`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 11,
          weight: 'normal',
        },
      },
    },
    y: {
      beginAtZero: true,
      min: 0,
      max: 30,
      ticks: {
        stepSize: 4,
        precision: 0,
        maxTicksLimit: 7,
        includeBounds: true,
        color: '#9CA3AF',
        font: {
          size: 11,
        },
      },
      grid: {
        color: '#E5E7EB',
        lineWidth: 1,
        drawBorder: false,
        drawTicks: false,
      },
      border: {
        display: false,
      },
    },
  },
}

const barRef = ref<ChartComponentRef<'bar'> | null>(null)

onMounted(() => {
  nextTick(() => {
    requestAnimationFrame(() => {
      const chart = barRef.value?.chart
      chart?.update('none')
    })
  })
})
</script>

<template>
  <div class="h-72 min-h-[16rem]">
    <Bar ref="barRef" :data="data" :options="options" />
  </div>
</template>
