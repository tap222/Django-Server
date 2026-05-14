import { ref } from 'vue'
import { teacherService } from '@/services/teacherService'
import type { TeacherRow } from '@/services/teacherService'

export function useTeachers() {
  const teachers = ref<TeacherRow[]>([])
  const loading = ref(false)
  const isDeleting = ref(false)

  async function fetchTeachers() {
    loading.value = true
    try {
      teachers.value = await teacherService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function deleteTeacher(id: string) {
    isDeleting.value = true
    try {
      await teacherService.deleteTeacher(id)
      await fetchTeachers()
    } finally {
      isDeleting.value = false
    }
  }

  return { teachers, loading, isDeleting, fetchTeachers, deleteTeacher }
}
