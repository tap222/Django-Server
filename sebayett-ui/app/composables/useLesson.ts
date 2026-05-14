import { ref } from 'vue'
import { lessonService } from '@/services/lessonService'
import type { LessonDetail } from '@/services/lessonService'

export function useLesson() {
  const lesson = ref<LessonDetail | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLesson(id: number) {
    isLoading.value = true
    error.value = null
    
    try {
      lesson.value = await lessonService.getLessonById(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch lesson'
      console.error('Failed to fetch lesson:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function pauseLesson(id: number) {
    try {
      await lessonService.pauseLesson(id)
      if (lesson.value && lesson.value.id === id) {
        lesson.value.status = 'paused'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to pause lesson'
      console.error('Failed to pause lesson:', err)
    }
  }

  async function deleteLesson(id: number) {
    try {
      await lessonService.deleteLesson(id)
      // Navigation will be handled by the calling component
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete lesson'
      console.error('Failed to delete lesson:', err)
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    lesson,
    isLoading,
    error,
    fetchLesson,
    pauseLesson,
    deleteLesson,
    clearError
  }
}
