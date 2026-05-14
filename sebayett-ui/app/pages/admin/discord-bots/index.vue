<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { ref, onMounted } from 'vue'
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'
import { useDiscordBots } from '@/composables/useDiscordBots'
import AddButton from '@/components/common/AddButton.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { DataTable } from '@/components/ui/data-table'
import type { ColumnDef } from '@/components/ui/data-table'

const { bots, loading, isDeleting, fetchBots, deleteBot } = useDiscordBots()
const showDeleteModal = ref(false)
const selectedBot = ref<Record<string, unknown> | null>(null)

const columns: ColumnDef[] = [
  { key: 'botId', label: 'Bot ID' },
  { key: 'serverId', label: 'Server ID' },
  { key: 'server', label: 'Server' },
  { key: 'token', label: 'Bot Token' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'action', label: 'Action', type: 'action' },
]

onMounted(fetchBots)

function onViewRow(row: Record<string, unknown>) {
  const id = row.botId
  if (typeof id !== 'string' || !id) return
  navigateTo(`/admin/discord-bots/${encodeURIComponent(id)}`)
}

function onEditRow(row: Record<string, unknown>) {
  const id = row.botId
  if (typeof id !== 'string' || !id) return
  navigateTo(`/admin/discord-bots/${encodeURIComponent(id)}/edit`)
}

function onDeleteRow(row: Record<string, unknown>) {
  selectedBot.value = row
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!selectedBot.value) return
  await deleteBot(String(selectedBot.value.botId ?? ''))
  showDeleteModal.value = false
  selectedBot.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-[30px] font-bold leading-tight text-gray-900">Discord Bots</h1>
      <AddButton @click="navigateTo('/admin/discord-bots/add')" />
    </div>

    <div class="overflow-hidden">
      <DataTable :columns="columns" :data="bots" :loading="loading">
        <template #cell-token="{ value }">
          <span class="block max-w-[180px] truncate" :title="value != null ? String(value) : undefined">{{ value ?? '-' }}</span>
        </template>
        <template #cell-action="{ row }">
          <div class="inline-flex items-center justify-center">
            <button type="button" class="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-orange-500 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600" aria-label="View" @click="onViewRow(row)">
              <Eye class="size-[20px]" aria-hidden="true" />
            </button>
            <button type="button" class="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#6681C4] transition-colors duration-200 hover:bg-[#6681C4]/10 hover:text-[#5570B3]" aria-label="Edit" @click="onEditRow(row)">
              <Pencil class="size-[20px]" aria-hidden="true" />
            </button>
            <button type="button" class="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700" aria-label="Delete" @click="onDeleteRow(row)">
              <Trash2 class="size-[20px]" aria-hidden="true" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <DeleteConfirmModal
      :is-open="showDeleteModal"
      title="Delete Bot?"
      :message="selectedBot ? `Are you sure you want to delete '${String(selectedBot.botId ?? '')}'?` : ''"
      :entity-name="selectedBot ? String(selectedBot.botId ?? '') : ''"
      confirm-label="Delete Bot"
      :loading="isDeleting"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
