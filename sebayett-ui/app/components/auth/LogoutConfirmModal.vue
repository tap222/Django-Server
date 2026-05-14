<script setup lang="ts">
import BaseModal from '~/components/ui/BaseModal.vue'

const open = defineModel<boolean>({ required: true })

function onConfirm() {
  open.value = false
}
</script>

<template>
  <BaseModal
    v-model="open"
    aria-labelledby="logout-modal-heading"
    max-width-class="max-w-[440px]"
  >
    <div class="text-center">
      <h2
        id="logout-modal-heading"
        class="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
      >
        Sign Out
      </h2>
      <p class="mt-3 text-base leading-snug text-neutral-600">
        Are you sure you want to sign out?
      </p>
      <button
        type="button"
        class="mx-auto mt-8 inline-flex h-[52px] w-full max-w-xs items-center justify-center rounded-lg bg-brand px-5 text-base font-semibold text-white transition [transition-property:filter] hover:brightness-[1.04] active:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/45 focus-visible:ring-offset-2"
        @click="onConfirm"
      >
        Sign Out
      </button>
    </div>
  </BaseModal>
</template>
