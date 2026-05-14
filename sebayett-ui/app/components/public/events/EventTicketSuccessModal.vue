<script setup lang="ts">
import BaseModal from '~/components/ui/BaseModal.vue'
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'

const open = defineModel<boolean>({ required: true })
</script>

<template>
  <BaseModal
    v-model="open"
    max-width-class="max-w-2xl"
    aria-labelledby="event-ticket-success-heading"
  >
    <div class="text-center">
      <h2
        id="event-ticket-success-heading"
        class="text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl sm:leading-tight"
      >
        <span class="block">Your ticket has been</span>
        <span class="block">successfully booked</span>
      </h2>
      <PrimaryButton
        variant="primary"
        to="/events"
        class="mx-auto mt-8 w-fit px-10 py-3.5 text-base font-semibold sm:mt-10 sm:px-12 sm:py-4"
      >
        View more Events
      </PrimaryButton>
    </div>
  </BaseModal>
</template>
