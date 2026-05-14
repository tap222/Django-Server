<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

export interface BreadcrumbItem {
  label: string
  to?: string
}

withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    /** Chevron color between segments */
    separatorTone?: 'muted' | 'brand'
  }>(),
  { separatorTone: 'muted' },
)
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-sm">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-600">
      <template v-for="(item, idx) in items" :key="`${idx}-${item.label}`">
        <li class="flex items-center">
          <NuxtLink
            v-if="item.to && idx < items.length - 1"
            :to="item.to"
            class="rounded-sm transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
          >
            {{ item.label }}
          </NuxtLink>
          <span
            v-else
            class="font-medium text-neutral-900"
            :aria-current="idx === items.length - 1 ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        </li>
        <li
          v-if="idx < items.length - 1"
          class="flex items-center"
          :class="
            separatorTone === 'brand' ? 'text-brand' : 'text-neutral-400'
          "
          aria-hidden="true"
        >
          <ChevronRight class="size-4" />
        </li>
      </template>
    </ol>
  </nav>
</template>
