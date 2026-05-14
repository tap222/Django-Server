import { ref } from 'vue'

export interface VacationRow {
  id: number
  title: string
  status: 'Completed' | 'Upcoming' | 'Ongoing'
  startDate: string
  endDate: string
  duration: string
}

export function useVacations() {
  const vacations = ref<VacationRow[]>([
    { id: 1, title: 'Summer Break', status: 'Completed', startDate: '2026-05-01', endDate: '2026-05-10', duration: '10 Days' },
    { id: 2, title: 'Winter Holidays', status: 'Upcoming', startDate: '2026-12-20', endDate: '2027-01-02', duration: '14 Days' },
    { id: 3, title: 'Personal Leave', status: 'Ongoing', startDate: '2026-03-25', endDate: '2026-03-28', duration: '4 Days' },
    { id: 4, title: 'Family Function Leave', status: 'Completed', startDate: '2026-02-05', endDate: '2026-02-07', duration: '3 Days' },
  ])
  
  const loading = ref(false)
  const page = ref(1)
  const pageSize = ref(8)
  const total = ref(4)

  async function fetchVacations() {
    // Immediate response for mock data
  }

  function goToPage(newPage: number) {
    page.value = newPage
  }

  async function removeVacation(id: number) {
    vacations.value = vacations.value.filter(v => v.id !== id)
    total.value = vacations.value.length
  }

  return { vacations, loading, page, pageSize, total, fetchVacations, goToPage, removeVacation }
}
