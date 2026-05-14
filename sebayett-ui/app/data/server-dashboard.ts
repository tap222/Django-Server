export interface ServerDashboardStats {
  upcomingEvents: number
  upcomingEventsChange: number
  monthlyEvents: number
  monthlyEventsChange: number
  income: number
  incomeChange: number
}

export interface DashboardEventRow {
  id: string
  thumbnail: string
  title: string
  category: string
  status: 'Accepted' | 'Pending' | 'Rejected'
}

export interface ServerDashboardData {
  username: string
  stats: ServerDashboardStats
  monthlyAttendees: number[]
  monthlyAttendeesTotal: number
  upcomingEvents: DashboardEventRow[]
}

const MOCK: ServerDashboardData = {
  username: 'kajalps',
  stats: {
    upcomingEvents: 22,
    upcomingEventsChange: 0.5,
    monthlyEvents: 78,
    monthlyEventsChange: 5,
    income: 80000,
    incomeChange: -2,
  },
  monthlyAttendees: [22, 13, 20, 17, 24, 12, 21, 17, 21], // Values estimated from bar chart in image
  monthlyAttendeesTotal: 28,
  upcomingEvents: [
    { id: '1', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&h=80&q=80', title: 'AI Innovation Summit', category: 'History', status: 'Accepted' },
    { id: '2', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=80&h=80&q=80', title: 'Frontend Friday', category: 'Psychology', status: 'Pending' },
    { id: '3', thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=80&h=80&q=80', title: 'Ethical Hacking Basics', category: 'Computer Science', status: 'Accepted' },
    { id: '4', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=80&h=80&q=80', title: 'Startup Pitch Night', category: 'Math', status: 'Rejected' },
  ],
}

export async function fetchServerDashboard(): Promise<ServerDashboardData> {
  await Promise.resolve()
  return MOCK
}
