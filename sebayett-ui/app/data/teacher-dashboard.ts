export interface TeacherDashboardStats {
  totalStudents: number
  totalStudentsChange: number
  totalEvents: number
  totalEventsChange: number
  totalLessons: number
  totalLessonsChange: number
}

export interface DashboardEventRow {
  id: string
  thumbnail: string
  title: string
  category: string
  status: 'Accepted' | 'Pending' | 'Rejected'
}

export interface DashboardLessonRow {
  id: string
  thumbnail: string
  title: string
  category: string
  status: 'Active' | 'Pending' | 'Cancel'
}

export interface TeacherDashboardData {
  username: string
  stats: TeacherDashboardStats
  monthlyLessons: number[]
  monthlyLessonsTotal: number
  incomeThisMonth: number
  incomeThisMonthPercentage: number
  incomeThisMonthChange: number
  upcomingEvents: DashboardEventRow[]
  lessons: DashboardLessonRow[]
}

const MOCK: TeacherDashboardData = {
  username: 'kajalps',
  stats: {
    totalStudents: 1250,
    totalStudentsChange: 0.5,
    totalEvents: 145,
    totalEventsChange: 5,
    totalLessons: 556,
    totalLessonsChange: -2,
  },
  monthlyLessons: [8, 12, 16, 20, 24, 18, 22, 14, 28, 16, 20, 24],
  monthlyLessonsTotal: 28,
  incomeThisMonth: 80000,
  incomeThisMonthPercentage: 80,
  incomeThisMonthChange: -2,
  upcomingEvents: [
    { id: '1', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&h=80&q=80', title: 'AI Innovation Summit', category: 'History', status: 'Accepted' },
    { id: '2', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=80&h=80&q=80', title: 'Frontend Friday', category: 'Psychology', status: 'Pending' },
    { id: '3', thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=80&h=80&q=80', title: 'Ethical Hacking Basics', category: 'Computer Science', status: 'Accepted' },
    { id: '4', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=80&h=80&q=80', title: 'Startup Pitch Night', category: 'Math', status: 'Rejected' },
  ],
  lessons: [
    { id: '1', thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=80&h=80&q=80', title: 'Advanced JavaScript', category: 'Programming', status: 'Active' },
    { id: '2', thumbnail: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=80&h=80&q=80', title: 'Data Structures', category: 'Computer Science', status: 'Active' },
    { id: '3', thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=80&h=80&q=80', title: 'Machine Learning Basics', category: 'AI', status: 'Pending' },
    { id: '4', thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=80&h=80&q=80', title: 'Web Design Principles', category: 'Design', status: 'Cancel' },
  ],
}

/**
 * Fetches teacher dashboard data.
 * Swap the body for $fetch('/api/teacher/dashboard') when the API exists.
 */
export async function fetchTeacherDashboard(): Promise<TeacherDashboardData> {
  await Promise.resolve()
  return MOCK
}
