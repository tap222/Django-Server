<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { ref, onMounted } from 'vue'
import { useGroups } from '@/composables/useGroups'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { DataTable } from '@/components/ui/data-table'
import type { ColumnDef } from '@/components/ui/data-table'
import type { GroupRow } from '@/services/groupService'

const { groups, loading, isDeleting, fetchGroups, deleteGroup } = useGroups()
const showDeleteModal = ref(false)
const selectedGroup = ref<GroupRow | null>(null)

const columns: ColumnDef[] = [
  { key: 'name', label: 'Group Name' },
  { key: 'permission', label: 'Permission' },
  { key: 'users', label: 'Users', type: 'actionButton' },
  { key: 'action', label: 'Action', type: 'delete' },
]

onMounted(fetchGroups)

function handleViewUsers(row: Record<string, unknown>) {
  navigateTo(`/admin/groups/${(row as GroupRow).slug}`)
}

function handleDeleteClick(row: Record<string, unknown>) {
  selectedGroup.value = row as GroupRow
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!selectedGroup.value) return
  await deleteGroup(selectedGroup.value.slug)
  showDeleteModal.value = false
  selectedGroup.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-[30px] font-bold leading-tight text-gray-900">Groups</h1>
    <div class="overflow-hidden">
      <DataTable :columns="columns" :data="groups" :loading="loading" @delete="handleDeleteClick">
        <template #cell-users="{ row }">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-[#19B77E] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-800"
            @click="handleViewUsers(row)"
          >
            View Users with this Role
          </button>
        </template>
      </DataTable>
    </div>

    <DeleteConfirmModal
      :is-open="showDeleteModal"
      title="Delete Group?"
      :message="selectedGroup ? `Are you sure you want to delete '${selectedGroup.name}'?` : ''"
      :entity-name="selectedGroup?.name"
      confirm-label="Delete Group"
      :loading="isDeleting"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
