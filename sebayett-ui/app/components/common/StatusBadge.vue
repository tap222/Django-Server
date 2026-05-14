<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  status?: string | null
}>()

const normalizedStatus = computed(() => String(props.status ?? '').trim().toLowerCase())

const badgeClass = computed(() => {
  switch (normalizedStatus.value) {
    case 'confirmed':
    case 'active':
      return 'border border-emerald-200 bg-emerald-50 text-emerald-600'
    case 'pending':
    case 'paused':
      return 'border border-amber-200 bg-amber-50 text-amber-600'
    case 'refused':
    case 'cancel':
      return 'border border-rose-200 bg-rose-50 text-rose-600'
    default:
      return 'border border-gray-200 bg-gray-50 text-gray-600'
  }
})

const displayLabel = computed(() => {
  const raw = String(props.status ?? '').trim()
  if (!raw) {
    return 'Unknown'
  }

  return raw
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
})
</script>

<template>
  <span
    :class="cn('inline-flex items-center justify-center rounded-full px-3 py-1 text-xs leading-none font-semibold', badgeClass)"
  >
    {{ displayLabel }}
  </span>
</template>
