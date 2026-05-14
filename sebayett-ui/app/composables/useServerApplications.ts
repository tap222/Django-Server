import { ref } from 'vue'
import { serverApplicationService } from '@/services/serverApplicationService'
import type { ServerApplicationRow } from '@/services/serverApplicationService'

export function useServerApplications() {
  const applications = ref<ServerApplicationRow[]>([])
  const loading = ref(false)

  async function fetchApplications() {
    loading.value = true
    try {
      applications.value = await serverApplicationService.getAll()
    } finally {
      loading.value = false
    }
  }

  return { applications, loading, fetchApplications }
}
