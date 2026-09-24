export interface TeacherRow {
  id: string
  firstName: string
  lastName: string
  expertise: string
  gender: string
  dob: string
  action: string
}

export const teacherService = {
  async getAll(): Promise<TeacherRow[]> {
    const rows = await useApiFetch()<Omit<TeacherRow, 'action'>[]>('/api/teachers')
    return rows.map((t) => ({ ...t, gender: capitalize(t.gender), dob: formatDateOnly(t.dob), action: '' }))
  },

  async deleteTeacher(id: string): Promise<void> {
    await useApiFetch()(`/api/teachers/${id}`, { method: 'DELETE' })
  },
}
