<script setup lang="ts">
const page = defineModel<number>({ required: true })

const props = withDefaults(
  defineProps<{
    totalPages: number
    /** Inactive page numbers are plain text (no bordered tiles). */
    variant?: 'default' | 'minimal'
  }>(),
  { variant: 'default' },
)

function goTo(n: number) {
  const target = Math.min(Math.max(1, n), props.totalPages)
  if (target !== page.value)
    page.value = target
}

function goPrev() {
  goTo(page.value - 1)
}

function goNext() {
  goTo(page.value + 1)
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    aria-label="Pagination"
    class="mt-12 flex items-center justify-center gap-2 text-sm sm:mt-16"
  >
    <button
      type="button"
      :class="[
        'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
        page > 1
          ? 'text-brand font-semibold hover:text-brand/90'
          : 'cursor-not-allowed text-neutral-400 opacity-60',
      ]"
      :disabled="page <= 1"
      aria-label="Previous page"
      @click="goPrev"
    >
      Previous
    </button>

    <button
      v-for="n in totalPages"
      :key="n"
      type="button"
      :class="[
        'inline-flex size-9 items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
        n === page
          ? 'bg-brand font-semibold text-white'
          : props.variant === 'minimal'
            ? 'font-medium text-neutral-500 hover:text-neutral-700'
            : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',
      ]"
      :aria-current="n === page ? 'page' : undefined"
      :aria-label="`Go to page ${n}`"
      @click="goTo(n)"
    >
      {{ n }}
    </button>

    <button
      type="button"
      :class="[
        'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
        page < totalPages
          ? 'text-brand font-semibold hover:text-brand/90'
          : 'cursor-not-allowed text-neutral-400 opacity-60',
      ]"
      :disabled="page >= totalPages"
      aria-label="Next page"
      @click="goNext"
    >
      Next
    </button>
  </nav>
</template>
