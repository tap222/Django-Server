<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'
import {
  LANDING_CTA_PRIMARY_CLASSES,
  LANDING_CTA_SECONDARY_CLASSES,
} from '~/config/landingCtaButton'
import PublicButton from '~/components/public/buttons/PublicButton.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    preset?: 'default' | 'landing'
    to?: RouteLocationRaw
  }>(),
  {
    variant: 'primary',
    preset: 'default',
  },
)

const attrs = useAttrs()

const mergedClass = computed(() => {
  const presetClasses =
    props.preset === 'landing'
      ? props.variant === 'primary'
        ? LANDING_CTA_PRIMARY_CLASSES
        : LANDING_CTA_SECONDARY_CLASSES
      : ''
  return cn(presetClasses, attrs.class as ClassValue | undefined)
})

const passthrough = computed(() => {
  const { class: _c, ...rest } = attrs
  return rest
})
</script>

<template>
  <PublicButton
    :variant="props.variant === 'primary' ? 'solid' : 'outline'"
    :to="props.to"
    :class="mergedClass"
    v-bind="passthrough"
  >
    <slot />
  </PublicButton>
</template>
