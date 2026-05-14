<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { computed, onMounted } from 'vue'
import { useGroupUsers } from '@/composables/useGroups'
import { DataTable } from '@/components/ui/data-table'
import type { ColumnDef } from '@/components/ui/data-table'
import type { UserRole } from '@/services/groupService'

const route = useRoute()

const roleSlug = computed(() => {
  const raw = route.params.roleSlug
  return decodeURIComponent(String(Array.isArray(raw) ? raw[0] : raw))
})

const roleNames: Record<string, string> = { admin: 'Admin', server: 'Server', teacher: 'Teacher' }
const roleName = computed(() => roleNames[roleSlug.value.toLowerCase()] ?? 'Unknown Role')

const { users, loading, fetchUsers, revokeRole } = useGroupUsers(roleSlug.value)

const columns: ColumnDef[] = [
  { key: 'name', label: 'Name' },
  { key: 'roles', label: 'Groups' },
  { key: 'joinedAt', label: 'Joined On' },
  { key: 'action', label: 'Action' },
]

const tableData = computed(() =>
  users.value.map(u => ({ ...u, roles: u.roles.join(' / ') }))
)

onMounted(fetchUsers)

function handleRevokeRole(row: Record<string, unknown>) {
  revokeRole((row as UserRole).id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-[30px] font-bold leading-tight text-gray-900">Groups: {{ roleName }}</h1>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50"
        @click="$router.back()"
      >
        Back
      </button>
    </header>

    <div class="overflow-hidden">
      <DataTable :columns="columns" :data="tableData" :loading="loading" @delete="handleRevokeRole">
        <template #cell-action="{ row }">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
            @click="handleRevokeRole(row)"
          >
            Revoke Role
          </button>
        </template>
      </DataTable>
    </div>
  </div>
</template>
