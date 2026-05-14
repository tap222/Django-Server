<script setup lang="ts">
import BaseModal from '~/components/ui/BaseModal.vue'
import HeroDiscordIcon from '~/components/public/ui/HeroDiscordIcon.vue'
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  'discord-sign-in': []
}>()

function onDiscordClick() {
  emit('discord-sign-in')
}
</script>

<template>
  <BaseModal
    v-model="open"
    aria-labelledby="auth-modal-heading"
  >
    <div class="text-center">
      <h2
        id="auth-modal-heading"
        class="text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-[2.25rem] sm:leading-tight"
      >
        Welcome to <span class="text-brand">Sebayett</span>
      </h2>
      <p class="mt-3 text-base leading-snug text-neutral-600 sm:text-lg">
        Sign up to access a world of top-tier coaching
      </p>
      <PrimaryButton
        preset="landing"
        variant="primary"
        class="mx-auto mt-8 w-full max-w-xs gap-2.5 sm:mt-10 sm:w-[58%] sm:max-w-none"
        @click="onDiscordClick"
      >
        <HeroDiscordIcon ui-class="size-[22px] shrink-0 text-white" />
        Sign in with Discord
      </PrimaryButton>
    </div>
  </BaseModal>
</template>
