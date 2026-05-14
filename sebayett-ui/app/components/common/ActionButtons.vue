<script setup lang="ts">
const emit = defineEmits<{
  accept: []
  reject: []
}>()
</script>

<template>
  <div
    class="grid w-full grid-cols-2 gap-4"
    role="group"
    aria-label="Application decision"
  >
    <button
      type="button"
      class="inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-600"
      @click="emit('accept')"
    >
      Accept
    </button>
    <button
      type="button"
      class="inline-flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600"
      @click="emit('reject')"
    >
      Reject
    </button>
  </div>
</template>
