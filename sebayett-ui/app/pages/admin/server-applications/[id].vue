<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })
import { computed } from 'vue'
import { SearchX } from 'lucide-vue-next'
import BackButton from '@/components/common/BackButton.vue'
import { serverApplicationService } from '@/services/serverApplicationService'
import type { ServerApplicationDetail } from '@/services/serverApplicationService'

const route = useRoute()
const rawId = route.params.id
const id = Array.isArray(rawId) ? rawId[0] : rawId
const decodedId = (() => { try { return decodeURIComponent(id) } catch { return id } })()

const { data, loading } = await useAsyncData(`server-app-${decodedId}`, () => serverApplicationService.getById(decodedId))
const application = computed(() => data.value as ServerApplicationDetail | null)

const detailRows: Array<{ label: string; key: keyof ServerApplicationDetail }> = [
  { label: 'First Name', key: 'firstName' },
  { label: 'Last Name', key: 'lastName' },
  { label: 'Server Name', key: 'serverName' },
  { label: 'Server ID', key: 'serverId' },
  { label: 'Server Description', key: 'serverDescription' },
  { label: 'Server Interests', key: 'serverInterests' },
]

function onAccept() {
  serverApplicationService.accept(decodedId)
}

function onReject() {
  serverApplicationService.reject(decodedId)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <h1 class="text-[30px] font-bold leading-tight text-gray-900">
          Application for Server
        </h1>
        <p v-if="application" class="text-sm font-medium text-orange-500">
          {{ application.serverName }}
        </p>
      </div>
      <BackButton />
    </header>

    <div v-if="loading" class="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
    </div>

    <div v-else-if="application" class="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div class="p-6 sm:p-8">
        <div class="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          <div v-for="row in detailRows" :key="row.key" class="space-y-1.5">
            <p class="text-sm font-medium text-gray-400">{{ row.label }}</p>
            <p class="text-base font-semibold text-gray-900 leading-relaxed">{{ application[row.key] }}</p>
          </div>
        </div>

        <div class="mt-10 flex items-center gap-3 border-t border-gray-100 pt-8">
          <button 
            type="button" 
            class="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-8 text-sm font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95" 
            @click="onAccept"
          >
            Accept Application
          </button>
          <button 
            type="button" 
            class="inline-flex h-11 items-center justify-center rounded-xl bg-red-500 px-8 text-sm font-bold text-white transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-95" 
            @click="onReject"
          >
            Reject
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-12 shadow-sm">
      <div class="rounded-full bg-orange-50 p-4">
        <SearchX class="size-8 text-orange-500" />
      </div>
      <div class="text-center">
        <h3 class="text-lg font-bold text-gray-900">Application Not Found</h3>
        <p class="mt-1 text-sm text-gray-500">No application matches this ID. It may have been moved or deleted.</p>
      </div>
      <NuxtLink to="/admin/server-applications" class="mt-2 text-sm font-bold text-orange-500 hover:underline">
        Back to List
      </NuxtLink>
    </div>
  </div>
</template>
