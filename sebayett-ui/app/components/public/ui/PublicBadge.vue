<script setup lang="ts">
import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: ClassValue
}>()
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center rounded-full border border-brand/35 bg-brand/[0.07] px-3 py-1 text-xs font-semibold tracking-wide text-brand sm:px-3.5 sm:py-1.5 sm:text-sm',
        props.class,
      )
    "
  >
    <slot />
  </span>
</template>
