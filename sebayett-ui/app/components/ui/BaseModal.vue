<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { ClassValue } from 'clsx'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    maxWidthClass?: string
    closeOnBackdrop?: boolean
    showCloseButton?: boolean
    panelClass?: ClassValue
    ariaLabel?: string
    ariaLabelledby?: string
  }>(),
  {
    maxWidthClass: 'max-w-[560px]',
    closeOnBackdrop: true,
    showCloseButton: true,
    panelClass: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const closeBtnRef = ref<HTMLButtonElement | null>(null)
let previousActiveElement: HTMLElement | null = null

function close() {
  if (!props.modelValue)
    return
  emit('update:modelValue', false)
  emit('close')
}

function onBackdropClick(event: MouseEvent) {
  if (!props.closeOnBackdrop)
    return
  if (event.target === event.currentTarget)
    close()
}

function onKeydown(event: KeyboardEvent) {
  if (!props.modelValue)
    return
  if (event.key === 'Escape')
    close()
}

watch(
  () => props.modelValue,
  async (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      previousActiveElement = document.activeElement as HTMLElement | null
      await nextTick()
      closeBtnRef.value?.focus()
    }
    else if (previousActiveElement?.focus) {
      previousActiveElement.focus()
      previousActiveElement = null
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
        @click="onBackdropClick"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="modelValue"
            :class="
              cn(
                'relative w-full rounded-3xl bg-white ring-1 ring-violet-400/35',
                props.maxWidthClass,
                props.panelClass,
              )
            "
            role="dialog"
            aria-modal="true"
            :aria-label="ariaLabel"
            :aria-labelledby="ariaLabelledby"
            @click.stop
          >
            <button
              v-if="showCloseButton"
              ref="closeBtnRef"
              type="button"
              class="absolute right-5 top-5 inline-flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
              aria-label="Close dialog"
              @click="close"
            >
              <X class="size-[18px] stroke-[1.75]" aria-hidden="true" />
            </button>

            <div class="px-8 pb-10 pt-14 sm:px-10 sm:pb-12">
              <slot name="title" />
              <slot />
            </div>

            <div
              v-if="$slots.footer"
              class="border-t border-neutral-100 px-8 py-4 sm:px-10"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
