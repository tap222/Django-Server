<script setup lang="ts">
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'

defineProps<{
  imageSrc: string
  imageAlt: string
  badge: string
  title: string
  description: string
  ctaLabel: string
  ctaTo?: string
}>()
</script>

<template>
  <article
    class="flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-lg motion-safe:hover:-translate-y-0.5"
  >
    <div
      class="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100"
    >
      <img
        :src="imageSrc"
        :alt="imageAlt"
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        width="640"
        height="400"
      >
      <span
        class="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-brand shadow-sm ring-1 ring-neutral-200/80"
      >
        {{ badge }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <h3
        class="text-base font-bold tracking-tight text-neutral-900 sm:text-lg"
      >
        {{ title }}
      </h3>
      <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">
        {{ description }}
      </p>

      <div class="mt-auto pt-4">
        <PrimaryButton
          variant="primary"
          :to="ctaTo"
          class="w-full rounded-lg"
        >
          {{ ctaLabel }}
        </PrimaryButton>
      </div>
    </div>
  </article>
</template>
