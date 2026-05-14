<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { ref, onMounted } from 'vue'
import { Eye, Trash2 } from 'lucide-vue-next'
import { useServers } from '@/composables/useServers'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { DataTable } from '@/components/ui/data-table'
import type { ColumnDef } from '@/components/ui/data-table'
import type { ServerRow } from '@/services/serverService'

const { servers, loading, isDeleting, fetchServers, deleteServer } = useServers()
const showDeleteModal = ref(false)
const selectedServer = ref<ServerRow | null>(null)

const columns: ColumnDef[] = [
  { key: 'serverId', label: 'Server ID' },
  { key: 'serverName', label: 'Server Name' },
  { key: 'serverInterests', label: 'Server Interests' },
  { key: 'serverDescription', label: 'Server Description' },
  { key: 'joined', label: 'Joined' },
  { key: 'action', label: 'Action', type: 'action' },
]

onMounted(fetchServers)

function onViewServer(row: Record<string, unknown>) {
  const id = row.serverId
  if (typeof id !== 'string' || !id) return
  navigateTo(`/admin/servers/${encodeURIComponent(id)}`)
}

function handleDeleteClick(row: Record<string, unknown>) {
  selectedServer.value = row as ServerRow
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!selectedServer.value) return
  await deleteServer(selectedServer.value.serverId)
  showDeleteModal.value = false
  selectedServer.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-[30px] font-bold leading-tight text-gray-900">Servers</h1>

    <div class="overflow-hidden">
      <DataTable :columns="columns" :data="servers" :loading="loading">
        <template #cell-serverDescription="{ value }">
          <span class="block max-w-[220px] truncate font-semibold text-gray-900" :title="String(value ?? '')">{{ value ?? '-' }}</span>
        </template>
        <template #cell-action="{ row }">
          <div class="inline-flex items-center justify-center gap-2">
            <button
              type="button"
              class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-orange-500 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600"
              aria-label="View server"
              @click="onViewServer(row)"
            >
              <Eye class="lucide size-[20px] lucide-eye-icon lucide-eye size-[20px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
              aria-label="Delete server"
              @click="handleDeleteClick(row)"
            >
              <Trash2 class="lucide size-[20px] lucide-eye-icon lucide-eye size-[20px]" aria-hidden="true" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <DeleteConfirmModal
      :is-open="showDeleteModal"
      title="Delete Server?"
      :message="selectedServer ? `Are you sure you want to delete '${selectedServer.serverName}'?` : ''"
      :entity-name="selectedServer?.serverName"
      confirm-label="Delete Server"
      :loading="isDeleting"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
