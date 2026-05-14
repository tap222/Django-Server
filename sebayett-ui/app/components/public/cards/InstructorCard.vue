<script setup lang="ts">
import { computed } from 'vue'
import { Star, Users } from 'lucide-vue-next'

const props = defineProps<{
  name: string
  role: string
  imageSrc: string
  imageAlt: string
  rating: number
  studentCount: number
}>()

const ratingLabel = computed(() => props.rating.toFixed(1))

const studentsLabel = computed(
  () => `${props.studentCount.toLocaleString('en-US')} students`,
)
</script>

<template>
  <article
    class="flex min-w-0 w-full max-w-full flex-col overflow-hidden rounded-xl border border-neutral-200/35 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
  >
    <div>
      <img
        :src="imageSrc"
        :alt="imageAlt"
        loading="lazy"
        decoding="async"
        width="232"
        height="261"
      >
    </div>
    <div class="flex flex-col pt-2">
      <h3
        class="text-[16px] font-bold leading-[1.25] tracking-tight text-neutral-900"
      >
        {{ name }}
      </h3>
      <p class="mt-px text-[11px] leading-tight text-neutral-500">
        {{ role }}
      </p>
      <div class="mt-3 max-w-full">
        <div
          class="flex max-w-full flex-nowrap items-center justify-start gap-1 text-[10px] leading-none tabular-nums"
        >
          <span
            class="inline-flex me-1 shrink-0 items-center gap-px whitespace-nowrap rounded-full bg-orange-50 p-1 font-semibold text-brand ring-1 ring-orange-100/70"
          >
            <Star class="size-2.5 shrink-0 fill-current text-brand me-1" aria-hidden="true" stroke-width="2" />
            {{ ratingLabel }}
          </span>
          <span
            class="inline-flex shrink-0 items-center gap-px whitespace-nowrap rounded-full bg-blue-50 p-1 mr-2 font-medium text-blue-600 ring-1 ring-blue-100/90"
          >
            <Users class="size-2.5 shrink-0 text-blue-600 me-1" aria-hidden="true" />
            {{ studentsLabel }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>
