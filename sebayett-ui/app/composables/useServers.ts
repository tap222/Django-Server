import { ref } from 'vue'
import { serverService } from '@/services/serverService'
import type { ServerRow } from '@/services/serverService'

export function useServers() {
  const servers = ref<ServerRow[]>([])
  const loading = ref(false)
  const isDeleting = ref(false)

  async function fetchServers() {
    loading.value = true
    try {
      servers.value = await serverService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function deleteServer(id: string) {
    isDeleting.value = true
    try {
      await serverService.deleteServer(id)
      await fetchServers()
    } finally {
      isDeleting.value = false
    }
  }

  return { servers, loading, isDeleting, fetchServers, deleteServer }
}
