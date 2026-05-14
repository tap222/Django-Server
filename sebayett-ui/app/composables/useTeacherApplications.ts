import { ref } from 'vue'
import { teacherApplicationService } from '@/services/teacherApplicationService'
import type { TeacherApplicationRow } from '@/services/teacherApplicationService'

export function useTeacherApplications() {
  const applications = ref<TeacherApplicationRow[]>([])
  const loading = ref(false)

  async function fetchApplications() {
    loading.value = true
    try {
      applications.value = await teacherApplicationService.getAll()
    } finally {
      loading.value = false
    }
  }

  return { applications, loading, fetchApplications }
}
