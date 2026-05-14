<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { ref } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import ActionButton from '@/components/common/ActionButton.vue'
import BackButton from '@/components/common/BackButton.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { discordBotService } from '@/services/discordBotService'
import type { BotDetail } from '@/services/discordBotService'

const route = useRoute()
const rawId = route.params.botId
const botId = Array.isArray(rawId) ? rawId[0] : rawId
const decodedId = (() => { try { return decodeURIComponent(botId) } catch { return botId } })()

const { data } = await useAsyncData(`bot-${decodedId}`, () => discordBotService.getById(decodedId))
const bot = data.value as BotDetail | null

const detailRows: Array<{ label: string; key: keyof BotDetail }> = [
  { label: 'Bot ID', key: 'botId' },
  { label: 'Server ID', key: 'serverId' },
  { label: 'Server', key: 'server' },
  { label: 'Bot Token', key: 'token' },
  { label: 'Created At', key: 'createdAt' },
]

const showDeleteModal = ref(false)
const isDeleting = ref(false)

function onEdit() {
  navigateTo(`/admin/discord-bots/${encodeURIComponent(decodedId)}/edit`)
}

async function confirmDelete() {
  isDeleting.value = true
  try {
    await discordBotService.deleteBot(decodedId)
    showDeleteModal.value = false
    navigateTo('/admin/discord-bots')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section>
    <template v-if="bot">
      <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Bot: {{ bot.botId }}</h1>
        <div class="flex items-center gap-3">
          <ActionButton label="Edit" variant="blue" @click="onEdit">
            <template #icon><Pencil class="size-4" aria-hidden="true" /></template>
          </ActionButton>
          <ActionButton label="Delete" variant="red" @click="showDeleteModal = true">
            <template #icon><Trash2 class="size-4" aria-hidden="true" /></template>
          </ActionButton>
          <BackButton />
        </div>
      </header>

      <div class="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div class="space-y-5">
          <div v-for="row in detailRows" :key="row.key" class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
            <p class="w-full shrink-0 text-md font-medium text-gray-500 sm:w-44">{{ row.label }}:</p>
            <p :class="['text-md font-semibold text-gray-900 sm:text-base', row.key === 'token' && 'break-all']">{{ bot[row.key] }}</p>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        :is-open="showDeleteModal"
        title="Delete Bot?"
        :message="`Are you sure you want to delete bot '${bot.botId}'?`"
        :entity-name="bot.botId"
        confirm-label="Delete Bot"
        :loading="isDeleting"
        @close="showDeleteModal = false"
        @confirm="confirmDelete"
      />
    </template>

    <template v-else>
      <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Bot not found</h1>
        <BackButton />
      </header>
      <p class="text-sm text-gray-600">No bot matches this ID. Return to the list and try again.</p>
    </template>
  </section>
</template>
