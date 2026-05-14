export type LessonStatus = 'active' | 'pending' | 'cancel' | 'paused'

export interface LessonRow {
  id: number
  slug: string
  title: string
  thumbnail: string
  category: string
  teacher: string
  createdAt: string
  status: LessonStatus
  action: ''
}

export interface ScheduleItem {
  day: string
  enabled: boolean
  startTime: string
  endTime: string
}

export interface CreateLessonData {
  title: string
  category: string
  description: string
  startDate: string
  endDate: string
  schedule: ScheduleItem[]
  banner: File | null
}

export interface LessonDetail {
  id: number
  title: string
  category: string
  teacher: string
  createdAt: string
  image: string
  status: 'active' | 'paused'
}

export interface LessonListParams {
  page?: number
  pageSize?: number
}

export interface LessonListResponse {
  data: LessonRow[]
  total: number
}

const MOCK_LESSONS: LessonRow[] = [
  { id: 1, slug: 'the-roman-empire-1', title: 'The Roman Empire', thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=160&h=100&q=80', category: 'History', teacher: 'Derrick', createdAt: 'March 1, 2026', status: 'active', action: '' },
  { id: 2, slug: 'human-behavior-basics-1', title: 'Human Behavior Basics', thumbnail: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=160&h=100&q=80', category: 'Psychology', teacher: 'Achraf', createdAt: 'March 5, 2026', status: 'pending', action: '' },
  { id: 3, slug: 'programming-fundamentals-1', title: 'Programming Fundamentals', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=160&h=100&q=80', category: 'Computer Science', teacher: 'Liam', createdAt: 'March 1, 2026', status: 'active', action: '' },
  { id: 4, slug: 'advanced-algebra', title: 'Advanced Algebra', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=160&h=100&q=80', category: 'Math', teacher: 'Derrick', createdAt: 'March 6, 2026', status: 'cancel', action: '' },
  { id: 5, slug: 'laws-of-motion', title: 'Laws of Motion', thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=160&h=100&q=80', category: 'Physics', teacher: 'Achraf', createdAt: 'March 10, 2026', status: 'pending', action: '' },
  { id: 6, slug: 'the-roman-empire-2', title: 'The Roman Empire', thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=160&h=100&q=80', category: 'History', teacher: 'Derrick', createdAt: 'March 14, 2026', status: 'active', action: '' },
  { id: 7, slug: 'human-behavior-basics-2', title: 'Human Behavior Basics', thumbnail: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=160&h=100&q=80', category: 'Psychology', teacher: 'Liam', createdAt: 'March 15, 2026', status: 'pending', action: '' },
  { id: 8, slug: 'programming-fundamentals-2', title: 'Programming Fundamentals', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=160&h=100&q=80', category: 'Computer Science', teacher: 'Derrick', createdAt: 'March 16, 2026', status: 'active', action: '' },
]

const MOCK_DETAILS: LessonDetail[] = [
  { id: 1, title: 'The Roman Empire', category: 'History', teacher: 'Derrick', createdAt: 'March 1, 2026', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80', status: 'active' },
  { id: 2, title: 'Human Behavior Basics', category: 'Psychology', teacher: 'Achraf', createdAt: 'March 5, 2026', image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1200&q=80', status: 'active' },
  { id: 3, title: 'Programming Fundamentals', category: 'Computer Science', teacher: 'Liam', createdAt: 'March 1, 2026', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', status: 'paused' },
  { id: 4, title: 'Advanced Algebra', category: 'Math', teacher: 'Derrick', createdAt: 'March 6, 2026', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80', status: 'active' },
  { id: 5, title: 'Laws of Motion', category: 'Physics', teacher: 'Achraf', createdAt: 'March 10, 2026', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80', status: 'active' },
  { id: 6, title: 'Historical Civilizations', category: 'History', teacher: 'Derrick', createdAt: 'March 14, 2026', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80', status: 'paused' },
]

// Swap bodies for $fetch('/api/lessons', { params }) when the API exists
export const lessonService = {
  async getLessons(params: LessonListParams = {}): Promise<LessonListResponse> {
    await Promise.resolve()
    const { page = 1, pageSize = 8 } = params
    const start = (page - 1) * pageSize
    return { data: MOCK_LESSONS.slice(start, start + pageSize), total: 76 }
  },

  async getLessonById(id: number): Promise<LessonDetail | null> {
    await Promise.resolve()
    return MOCK_DETAILS.find(l => l.id === id) ?? null
  },

  async createLesson(data: CreateLessonData): Promise<LessonRow> {
    await Promise.resolve()
    // Mock implementation - log the data for development
    console.log('Creating lesson with data:', data)

    // Create slug from title
    const slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Mock thumbnail (in real app, this would come from banner upload)
    const thumbnail = 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=80&h=80&q=80'

    // Swap for $fetch('/api/lessons', { method: 'POST', body: data }) when the API exists
    return {
      id: Date.now(),
      slug,
      title: data.title,
      thumbnail,
      category: data.category,
      status: 'pending' as LessonStatus,
      action: ''
    }
  },

  async updateLesson(id: number, data: Partial<LessonRow>): Promise<LessonRow> {
    await Promise.resolve()
    // Swap for $fetch(`/api/lessons/${id}`, { method: 'PATCH', body: data }) when the API exists
    const existing = MOCK_LESSONS.find(l => l.id === id)!
    return { ...existing, ...data }
  },

  async pauseLesson(id: number): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/lessons/${id}/pause`, { method: 'PATCH' }) when API exists
    console.log('Pause lesson:', id)
  },

  async deleteLesson(id: number): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/lessons/${id}`, { method: 'DELETE' }) when API exists
    console.log('Delete lesson:', id)
  },
}
