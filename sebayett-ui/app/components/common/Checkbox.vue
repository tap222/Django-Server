<script setup lang="ts">
import { computed, useId } from 'vue'
import { Check } from 'lucide-vue-next'

const model = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    /** Optional explicit id; otherwise auto-generated */
    id?: string
    /** Accessible name when no visible label slot */
    ariaLabel?: string
  }>(),
  {
    disabled: false,
  },
)

const uid = useId()
const inputId = computed(() => props.id ?? `checkbox-${uid}`)
</script>

<template>
  <label
    class="inline-flex cursor-pointer items-center gap-2 focus-within:outline-none"
    :class="disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : ''"
    :for="inputId"
  >
    <span class="relative inline-flex shrink-0 items-center justify-center">
      <input
        :id="inputId"
        v-model="model"
        type="checkbox"
        class="peer sr-only"
        :disabled="disabled"
        :aria-label="ariaLabel"
      />
      <span
        class="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white transition-colors hover:border-neutral-400 peer-focus-visible:border-orange-500 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white peer-checked:border-[#F48220] peer-checked:bg-[#F48220] peer-checked:hover:border-[#ea7810] peer-checked:hover:bg-[#ea7810]"
        aria-hidden="true"
      >
        <Check
          v-show="model"
          class="size-3.5 text-white"
          :stroke-width="2.25"
        />
      </span>
    </span>
    <span
      v-if="$slots.default"
      class="select-none text-sm text-neutral-900"
    >
      <slot />
    </span>
  </label>
</template>
