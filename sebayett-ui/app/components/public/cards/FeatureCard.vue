<script setup lang="ts">
defineProps<{
  imageSrc: string
  imageAlt: string
  title: string
  description: string
}>()
</script>

<template>
  <article
    class="flex h-full flex-col items-center text-center rounded-2xl border border-neutral-200 shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:shadow-md">
    <div
      class="mb-5 flex aspect-[4/3] w-full items-center justify-center overflow-hidden">
      <img :src="imageSrc" :alt="imageAlt" class="h-full w-full object-contain object-center" loading="lazy"
        decoding="async" width="640" height="480">
    </div>
    <div class="flex w-full flex-col items-center p-4">
      <h3 class="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
        {{ title }}
      </h3>
      <p class="mt-3 max-w-sm text-xs leading-relaxed text-black sm:text-sm mb-4">
        {{ description }}
      </p>
    </div>
  </article>
</template>
