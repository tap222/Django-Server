<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { useRouter } from 'vue-router'
import BackButton from '@/components/common/BackButton.vue'
import DiscordBotForm from '@/components/discord-bots/DiscordBotForm.vue'

const router = useRouter()

function onSuccess() {
  // Navigate back to discord bots list after successful creation
  router.push('/admin/discord-bots')
}
</script>

<template>
  <section>
    <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Add a self-bot</h1>
      <BackButton />
    </header>

    <div class="mt-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <DiscordBotForm @success="onSuccess" />
    </div>
  </section>
</template>

