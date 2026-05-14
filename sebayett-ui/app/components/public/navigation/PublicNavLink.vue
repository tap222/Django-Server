<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const props = defineProps<{
  to: string
  label: string
}>()

const route = useRoute()

function normalizePath(path: string) {
  return path.replace(/\/$/, '') || '/'
}

/**
 * Uses Vue Router slot flags where they match; adds path-prefix checks for
 * flat Nuxt siblings (e.g. `/events` → `/events/:id`, `/lessons` → `/lessons/:id/book`)
 * because `isActive` is often false without a nested route record.
 */
function resolvedActive(
  routerIsActive: boolean,
  isExactActive: boolean,
): boolean {
  const to = props.to
  const hashIdx = to.indexOf('#')
  if (hashIdx !== -1) {
    const pathPart = to.slice(0, hashIdx)
    const normalizedTarget = normalizePath(pathPart)
    const current = normalizePath(route.path)
    if (normalizedTarget !== current) return false
    return route.hash === to.slice(hashIdx)
  }

  const normalizedTarget = normalizePath(to)
  if (normalizedTarget === '/') {
    return isExactActive
  }

  const current = normalizePath(route.path)
  const underSegment =
    current === normalizedTarget
    || current.startsWith(`${normalizedTarget}/`)

  return routerIsActive || underSegment
}

function linkClass(routerIsActive: boolean, isExactActive: boolean) {
  const active = resolvedActive(routerIsActive, isExactActive)
  const base =
    'rounded-lg px-1 py-1 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2'

  if (active) {
    return cn(base, 'text-brand', attrs.class as ClassValue | undefined)
  }

  return cn(
    base,
    'text-neutral-900 hover:text-neutral-700',
    attrs.class as ClassValue | undefined,
  )
}

const passthrough = computed(() => {
  const { class: _c, ...rest } = attrs
  return rest
})
</script>

<template>
  <NuxtLink
    :to="to"
    custom
    v-slot="{ href, navigate, isActive: routerIsActive, isExactActive }"
  >
    <a
      :href="href"
      :class="linkClass(routerIsActive, isExactActive)"
      :aria-current="
        resolvedActive(routerIsActive, isExactActive) ? 'page' : undefined
      "
      v-bind="passthrough"
      @click="navigate"
    >
      {{ label }}
    </a>
  </NuxtLink>
</template>
