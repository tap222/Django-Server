<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

export interface AccordionItemData {
  id: string
  title: string
  content: string
}

const props = defineProps<{
  items: AccordionItemData[]
}>()

const openId = ref<string | null>(props.items[0]?.id ?? null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}

function onKeydown(e: KeyboardEvent, id: string) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle(id)
  }
}

function contentParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="item in items"
      :key="item.id"
      class="rounded-xl bg-[#F9F9F9] px-6 py-5"
    >
      <h3>
        <button
          :id="`${item.id}-heading`"
          type="button"
          class="flex w-full items-center justify-between gap-4 text-left text-base font-semibold text-neutral-900 transition-colors hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F9]"
          :aria-expanded="openId === item.id"
          :aria-controls="`${item.id}-panel`"
          @click="toggle(item.id)"
          @keydown="onKeydown($event, item.id)"
        >
          <span class="min-w-0 pr-2">{{ item.title }}</span>
          <ChevronDown
            class="size-[18px] shrink-0 text-neutral-500 transition-transform duration-300"
            :class="openId === item.id ? 'rotate-180' : 'rotate-0'"
            aria-hidden="true"
            stroke-width="1.5"
          />
        </button>
      </h3>
      <div
        class="grid transition-[grid-template-rows] duration-300 ease-out"
        :class="openId === item.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <div
            :id="`${item.id}-panel`"
            role="region"
            :aria-labelledby="`${item.id}-heading`"
            class="mt-3 space-y-3 text-[0.9375rem] leading-relaxed text-neutral-600"
            tabindex="-1"
          >
            <p v-for="(para, i) in contentParagraphs(item.content)" :key="`${item.id}-p-${i}`">
              {{ para }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
