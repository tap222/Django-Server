<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  step: number
  icon: Component
  description: string
}>()
</script>

<template>
  <div class="relative z-10 flex h-full flex-col items-center text-center">
    <div
      class="mx-auto flex size-16 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg ring-4 ring-orange-50/90 sm:size-[4.5rem]"
      aria-hidden="true"
    >
      <component :is="icon" class="size-8 sm:size-9" stroke-width="2" />
    </div>
    <p class="mt-5 text-lg font-bold text-neutral-900 sm:text-xl">
      Step {{ step }}
    </p>
    <p class="mt-2 max-w-[min(100%,20rem)] text-base leading-relaxed text-neutral-600 sm:text-lg">
      {{ description }}
    </p>
  </div>
</template>
