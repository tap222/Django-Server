<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import ActionButton from '@/components/common/ActionButton.vue'
import BackButton from '@/components/common/BackButton.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { serverService } from '@/services/serverService'
import type { ServerDetail } from '@/services/serverService'

const route = useRoute()

const rawId = route.params.serverId
const serverId = Array.isArray(rawId) ? rawId[0] : rawId
const decodedId = (() => { try { return decodeURIComponent(serverId) } catch { return serverId } })()

const { data } = await useAsyncData(`server-${decodedId}`, () => serverService.getById(decodedId))
const server = ref<ServerDetail | null>(data.value ?? null)

const detailRows: Array<{ label: string; key: keyof ServerDetail }> = [
  { label: 'First Name', key: 'firstName' },
  { label: 'Last Name', key: 'lastName' },
  { label: 'Server Name', key: 'serverName' },
  { label: 'Server ID', key: 'serverId' },
  { label: 'Server Description', key: 'description' },
  { label: 'Server Interests', key: 'interests' },
  { label: 'Accepted On The', key: 'acceptedAt' },
]

const showDeleteModal = ref(false)
const isDeleting = ref(false)

async function confirmDelete() {
  if (!server.value) return
  isDeleting.value = true
  try {
    await serverService.deleteServer(server.value.serverId)
    showDeleteModal.value = false
    navigateTo('/admin/servers')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section>
    <template v-if="server">
      <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Discord Server: {{ server.serverName }}</h1>
        <div class="flex items-center gap-3">
          <ActionButton label="Delete" variant="red" @click="showDeleteModal = true">
            <template #icon><Trash2 class="size-4" aria-hidden="true" /></template>
          </ActionButton>
          <BackButton />
        </div>
      </header>

      <div class="mt-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <div class="space-y-5">
          <div v-for="row in detailRows" :key="row.key" class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
            <p class="w-full shrink-0 text-md font-medium text-gray-500 sm:w-44">{{ row.label }}:</p>
            <p class="text-md font-semibold text-gray-900 sm:text-base">{{ server[row.key] }}</p>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        :is-open="showDeleteModal"
        title="Delete Server?"
        :message="`Are you sure you want to delete '${server.serverName}'?`"
        :entity-name="server.serverName"
        confirm-label="Delete Server"
        :loading="isDeleting"
        @close="showDeleteModal = false"
        @confirm="confirmDelete"
      />
    </template>

    <template v-else>
      <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Server not found</h1>
        <BackButton />
      </header>
      <p class="text-sm text-gray-600">No server matches this ID. Return to the list and try again.</p>
    </template>
  </section>
</template>
