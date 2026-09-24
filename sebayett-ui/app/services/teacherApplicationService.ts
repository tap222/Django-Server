export interface TeacherApplicationRow {
  id: string
  firstName: string
  lastName: string
  gender: string
  expertise: string
  status: 'Pending' | 'Accepted' | 'Rejected'
  action: string
}

export interface TeacherApplicationDetail {
  firstName: string
  lastName: string
  gender: string
  dob: string
  expertise: string
  applicationId: string
}

type TeacherApplicationRowDto = Omit<TeacherApplicationRow, 'action' | 'status'> & { status: string }

export const teacherApplicationService = {
  async getAll(): Promise<TeacherApplicationRow[]> {
    const rows = await useApiFetch()<TeacherApplicationRowDto[]>('/api/teacher-applications')
    return rows.map((a) => ({
      ...a,
      gender: capitalize(a.gender),
      status: capitalize(a.status) as TeacherApplicationRow['status'],
      action: '',
    }))
  },

  async getById(id: string): Promise<TeacherApplicationDetail | null> {
    const app = await orNull(useApiFetch()<TeacherApplicationDetail>(`/api/teacher-applications/${id}`))
    return app && { ...app, gender: capitalize(app.gender), dob: formatDateOnly(app.dob) }
  },

  async accept(id: string): Promise<void> {
    await useApiFetch()(`/api/teacher-applications/${id}/accept`, { method: 'POST' })
  },

  async reject(id: string): Promise<void> {
    await useApiFetch()(`/api/teacher-applications/${id}/reject`, { method: 'POST' })
  },
}
