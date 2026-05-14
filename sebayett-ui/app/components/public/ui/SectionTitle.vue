<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    title: string
    /** First occurrence of this substring is wrapped in brand color (landing orange). */
    brandHighlightWord?: string
    description?: string
    badge?: string
    align?: 'center' | 'left'
    titleId: string
  }>(),
  {
    align: 'center',
  },
)

const titleSegments = computed(() => {
  const word = props.brandHighlightWord?.trim()
  if (!word || !props.title.includes(word)) return null
  const i = props.title.indexOf(word)
  return {
    before: props.title.slice(0, i),
    brand: word,
    after: props.title.slice(i + word.length),
  }
})

const wrapAlign = computed(() =>
  props.align === 'center' ? 'text-center mx-auto' : 'text-left',
)

const maxW = computed(() =>
  props.align === 'center' ? 'max-w-2xl' : 'max-w-3xl',
)
</script>

<template>
  <div :class="cn('motion-safe:animate-fade-up motion-reduce:opacity-100', wrapAlign, maxW)">
    <p
      v-if="badge"
      class="mb-3 text-xs font-semibold uppercase tracking-wider text-brand"
    >
      {{ badge }}
    </p>
    <h2
      :id="titleId"
      class="landing-section-title"
    >
      <template v-if="titleSegments">
        {{ titleSegments.before }}<span class="text-brand">{{ titleSegments.brand }}</span>{{ titleSegments.after }}
      </template>
      <template v-else>
        {{ title }}
      </template>
    </h2>
    <p
      v-if="description"
      class="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg"
    >
      {{ description }}
    </p>
  </div>
</template>
