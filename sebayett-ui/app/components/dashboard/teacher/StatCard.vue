<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: string | number
  title: string
  percentageChange: number
  iconSrc: string
}

const props = defineProps<Props>()

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const changeSign = computed(() => (props.percentageChange > 0 ? '+' : ''))
const changeColorClass = computed(() =>
  props.percentageChange < 0 ? 'text-red-500' : 'text-green-500',
)
</script>

<template>
  <article class="rounded-2xl bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-4xl font-bold text-orange-500">
          {{ formattedValue }}
        </p>
        <h2 class="mt-5 text-xl font-bold text-gray-900">
          {{ title }}
        </h2>
        <span class="flex items-center text-xs mt-1 gap-1 text-gray-500">
          <p :class="changeColorClass" class="font-medium">
            {{ changeSign }}{{ percentageChange }}%
          </p>
          <p class="font-normal text-gray-400">than last month</p>
        </span>
      </div>
      <div class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg bg-orange-100">
        <img
          :src="iconSrc"
          alt=""
          class="h-8 w-8 object-contain"
          aria-hidden="true"
        >
      </div>
    </div>
  </article>
</template>
