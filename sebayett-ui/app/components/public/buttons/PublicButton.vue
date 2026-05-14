<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { computed, useAttrs } from 'vue'
import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const props = withDefaults(
  defineProps<{
    variant?: 'solid' | 'outline'
    to?: RouteLocationRaw
  }>(),
  {
    variant: 'solid',
  },
)

const baseClass =
  'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium shadow-sm transition-[color,background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

const variantClass = computed(() =>
  props.variant === 'outline'
    ? 'border border-brand bg-white text-brand hover:bg-brand/5'
    : 'bg-brand text-brand-foreground hover:bg-brand/90',
)

const mergedClass = computed(() =>
  cn(baseClass, variantClass.value, attrs.class as ClassValue | undefined),
)

const passthrough = computed(() => {
  const { class: _c, ...rest } = attrs
  return rest
})
</script>

<template>
  <NuxtLink v-if="to !== undefined" :to="to" :class="mergedClass" v-bind="passthrough">
    <slot />
  </NuxtLink>
  <button
    v-else
    type="button"
    :class="mergedClass"
    v-bind="passthrough"
  >
    <slot />
  </button>
</template>
