<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
    <dt class="w-full shrink-0 text-base font-medium text-gray-500 sm:w-40">
      {{ label }}:
    </dt>
    <dd class="text-base font-semibold text-gray-900 sm:text-right">
      <slot name="value">
        {{ value }}
      </slot>
    </dd>
  </div>
</template>
