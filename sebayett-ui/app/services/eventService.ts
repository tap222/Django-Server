export interface EventRow {
  id: string
  title: string
  thumbnail: string
  status: 'Confirmed' | 'Pending' | 'Refused'
  server: string
  lesson: string
  teacher: string
  time: string
  date: string
  created_at: string
  action: string
}

export interface EventDetail {
  title: string
  server: string
  lesson: string
  teacher: string
  category: string
  time: string
  date: string
  status: 'Confirmed' | 'Pending' | 'Refused'
  createdAt: string
  imageUrl: string
}

const MOCK_ROWS: EventRow[] = [
  { id: 'ai-innovation-summit', title: 'AI Innovation Summit', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&h=80&q=80', status: 'Accepted', server: "Kajal's server", lesson: 'The Roman Empire', teacher: 'Derrick', time: '4 p.m.', date: 'March 27, 2026', created_at: 'March 1, 2026', action: '' },
  { id: 'frontend-friday', title: 'Frontend Friday', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=80&h=80&q=80', status: 'Pending', server: "Kajal's server", lesson: 'Human Behavior Basics', teacher: 'Achraf', time: '5 p.m.', date: 'March 28, 2026', created_at: 'March 4, 2026', action: '' },
  { id: 'ethical-hacking-basics', title: 'Ethical Hacking Basics', thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=80&h=80&q=80', status: 'Rejected', server: "Kajal's server", lesson: 'Laws of Motion', teacher: 'Liam', time: '1 p.m.', date: 'March 29, 2026', created_at: 'March 7, 2026', action: '' },
  { id: 'startup-pitch-night', title: 'Startup Pitch Night', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=80&h=80&q=80', status: 'Accepted', server: "Kajal's server", lesson: 'Advanced Algebra', teacher: 'Derrick', time: '2 p.m.', date: 'March 22, 2026', created_at: 'March 5, 2026', action: '' },
  { id: 'productivity-masterclass', title: 'Productivity Masterclass', thumbnail: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=80&h=80&q=80', status: 'Accepted', server: "Kajal's server", lesson: 'The Roman Empire', teacher: 'Liam', time: '4 p.m.', date: 'March 20, 2026', created_at: 'March 9, 2026', action: '' },
  { id: 'javascript-deep-dive', title: 'JavaScript Deep Dive', thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=80&h=80&q=80', status: 'Pending', server: "Kajal's server", lesson: 'Human Behavior Basics', teacher: 'Achraf', time: '9 p.m.', date: 'March 22, 2026', created_at: 'March 10, 2026', action: '' },
  { id: 'ui-ux-design-workshop', title: 'UI/UX Design Workshop', thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=80&h=80&q=80', status: 'Rejected', server: "Kajal's server", lesson: 'Advanced Algebra', teacher: 'Liam', time: '10 a.m.', date: 'March 25, 2026', created_at: 'March 11, 2026', action: '' },
  { id: 'data-analytics-bootcamp', title: 'Data Analytics Bootcamp', thumbnail: 'https://images.unsplash.com/photo-1551281044-8b0a4f5d4f89?auto=format&fit=crop&w=80&h=80&q=80', status: 'Accepted', server: "Kajal's server", lesson: 'Laws of Motion', teacher: 'Liam', time: '4 p.m.', date: 'March 28, 2026', created_at: 'March 13, 2026', action: '' },
]

const MOCK_DETAIL: Record<string, EventDetail> = {
  'ai-innovation-summit': { title: 'AI Innovation Summit', server: "Kajal's server", lesson: 'The Roman Empire', teacher: 'Derrick', category: 'History', time: '4 p.m.', date: 'March 26, 2026', status: 'Confirmed', createdAt: 'March 20, 2026', imageUrl: 'https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=1200&q=80' },
}

export const eventService = {
  async getAll(params: { page?: number; pageSize?: number; total?: number } = {}): Promise<{ data: EventRow[]; total: number }> {
    await Promise.resolve()
    // Swap for $fetch('/api/events', { params }) when the API exists
    const { page = 1, pageSize = 8, total = 76 } = params
    const allRows = Array.from({ length: total }, (_, i) => ({ ...MOCK_ROWS[i % MOCK_ROWS.length]! }))
    const start = (page - 1) * pageSize
    return { data: allRows.slice(start, start + pageSize), total }
  },

  async getById(id: string): Promise<EventDetail | null> {
    await Promise.resolve()
    
    // Check if we have specific mock detail first
    if (MOCK_DETAIL[id]) return MOCK_DETAIL[id]!

    // Otherwise, try to find it in mock rows and construct a detail object
    const row = MOCK_ROWS.find(r => r.id === id)
    if (!row) return null

    return {
      title: row.title,
      server: row.server,
      lesson: row.lesson,
      teacher: row.teacher,
      category: 'General',
      time: row.time,
      date: row.date,
      status: row.status,
      createdAt: row.created_at,
      imageUrl: row.thumbnail.replace('w=80&h=80', 'w=1200&h=800'), // Use a larger version of the same image
    }
  },

  async deleteEvent(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/events/${id}`, { method: 'DELETE' }) when the API exists
    console.log('Delete event:', id)
  },

  async cancelEvent(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/events/${id}/cancel`, { method: 'POST' }) when the API exists
    console.log('Cancel event:', id)
  },
}
