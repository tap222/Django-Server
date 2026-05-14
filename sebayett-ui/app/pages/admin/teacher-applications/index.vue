<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { onMounted } from 'vue'
import { useTeacherApplications } from '@/composables/useTeacherApplications'
import { DataTable } from '@/components/ui/data-table'
import type { ColumnDef } from '@/components/ui/data-table'

const { applications, loading, fetchApplications } = useTeacherApplications()

const columns: ColumnDef[] = [
  { key: 'id', label: 'Application ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'gender', label: 'Gender' },
  { key: 'expertise', label: 'Expertise' },
  { key: 'status', label: 'Status', type: 'badge' },
  { key: 'action', label: 'Action', type: 'view' },
]

onMounted(fetchApplications)

function onViewRow(row: Record<string, unknown>) {
  const id = row.id
  if (typeof id !== 'string' || !id) return
  navigateTo(`/admin/teacher-applications/${encodeURIComponent(id)}`)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-[30px] font-bold leading-tight text-gray-900">Teacher Applications</h1>
    <div class="overflow-hidden">
      <DataTable :columns="columns" :data="applications" :loading="loading" @view="onViewRow" />
    </div>
  </div>
</template>
