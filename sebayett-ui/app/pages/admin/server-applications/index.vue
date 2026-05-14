<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { onMounted } from 'vue'
import { useServerApplications } from '@/composables/useServerApplications'
import { DataTable } from '@/components/ui/data-table'
import type { ColumnDef } from '@/components/ui/data-table'

const { applications, loading, fetchApplications } = useServerApplications()

const columns: ColumnDef[] = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'serverName', label: 'Server Name' },
  { key: 'serverId', label: 'Server ID' },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'action', label: 'Action', type: 'view' },
]

onMounted(fetchApplications)

function onViewRow(row: Record<string, unknown>) {
  const id = row.serverId
  if (typeof id !== 'string' || !id) return
  navigateTo(`/admin/server-applications/${encodeURIComponent(id)}`)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-[30px] font-bold leading-tight text-gray-900">Server Applications</h1>
    <div class="overflow-hidden">
      <DataTable :columns="columns" :data="applications" :loading="loading" @view="onViewRow" />
    </div>
  </div>
</template>
