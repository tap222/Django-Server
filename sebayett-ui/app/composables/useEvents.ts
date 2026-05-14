import { ref } from 'vue'
import { eventService } from '@/services/eventService'
import type { EventRow } from '@/services/eventService'

export function useEvents() {
  const events = ref<EventRow[]>([])
  const loading = ref(false)
  const page = ref(1)
  const pageSize = ref(8)
  const total = ref(76)

  async function fetchEvents() {
    loading.value = true
    try {
      const res = await eventService.getAll({ page: page.value, pageSize: pageSize.value, total: total.value })
      events.value = res.data
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  async function goToPage(newPage: number) {
    page.value = newPage
    await fetchEvents()
  }

  async function changePageSize(newSize: number) {
    pageSize.value = newSize
    page.value = 1
    await fetchEvents()
  }

  async function deleteEvent(id: string) {
    await eventService.deleteEvent(id)
    await fetchEvents()
  }

  return { events, loading, page, pageSize, total, fetchEvents, goToPage, changePageSize, deleteEvent }
}
