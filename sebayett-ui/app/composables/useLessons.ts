import { ref } from 'vue'
import { lessonService } from '@/services/lessonService'
import type { LessonRow } from '@/services/lessonService'

export function useLessons() {
  const lessons = ref<LessonRow[]>([])
  const loading = ref(false)
  const page = ref(1)
  const pageSize = ref(8)
  const total = ref(0)

  async function fetchLessons() {
    loading.value = true
    try {
      const res = await lessonService.getLessons({ page: page.value, pageSize: pageSize.value })
      lessons.value = res.data
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  async function goToPage(newPage: number) {
    page.value = newPage
    await fetchLessons()
  }

  async function changePageSize(newSize: number) {
    pageSize.value = newSize
    page.value = 1
    await fetchLessons()
  }

  async function removeLesson(id: number) {
    await lessonService.deleteLesson(id)
    await fetchLessons()
  }

  return { lessons, loading, page, pageSize, total, fetchLessons, goToPage, changePageSize, removeLesson }
}
