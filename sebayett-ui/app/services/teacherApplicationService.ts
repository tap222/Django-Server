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

const MOCK_LIST: TeacherApplicationRow[] = [
  { id: '75e8a5ca-3de2-4501-8896-73fd54266a75', firstName: 'John', lastName: 'Wick', gender: 'Male', expertise: 'Math', status: 'Pending', action: '' },
  { id: 'a1b2c3d4-5e6f-7890-abcd-ef1234567890', firstName: 'Sarah', lastName: 'Chen', gender: 'Female', expertise: 'Physics', status: 'Accepted', action: '' },
  { id: 'f0e9d8c7-b6a5-4321-0fed-cba987654321', firstName: 'Marcus', lastName: 'Johnson', gender: 'Male', expertise: 'English', status: 'Rejected', action: '' },
  { id: '11223344-5566-7788-99aa-bbccddeeff00', firstName: 'Elena', lastName: 'Rodriguez', gender: 'Female', expertise: 'Chemistry', status: 'Pending', action: '' },
]

const MOCK_DETAIL: Record<string, TeacherApplicationDetail> = {
  '75e8a5ca-3de2-4501-8896-73fd54266a75': { firstName: 'John', lastName: 'Wick', gender: 'Male', dob: 'Nov. 27, 1990', expertise: 'Math', applicationId: '75e8a5ca-3de2-4501-8896-73fd54266a75' },
  'a1b2c3d4-5e6f-7890-abcd-ef1234567890': { firstName: 'Sarah', lastName: 'Chen', gender: 'Female', dob: 'Mar. 12, 1988', expertise: 'Physics', applicationId: 'a1b2c3d4-5e6f-7890-abcd-ef1234567890' },
  'f0e9d8c7-b6a5-4321-0fed-cba987654321': { firstName: 'Marcus', lastName: 'Johnson', gender: 'Male', dob: 'Jul. 3, 1995', expertise: 'English', applicationId: 'f0e9d8c7-b6a5-4321-0fed-cba987654321' },
  '11223344-5566-7788-99aa-bbccddeeff00': { firstName: 'Elena', lastName: 'Rodriguez', gender: 'Female', dob: 'Jan. 21, 1992', expertise: 'Chemistry', applicationId: '11223344-5566-7788-99aa-bbccddeeff00' },
}

export const teacherApplicationService = {
  async getAll(): Promise<TeacherApplicationRow[]> {
    await Promise.resolve()
    // Swap for $fetch('/api/teacher-applications') when the API exists
    return MOCK_LIST
  },

  async getById(id: string): Promise<TeacherApplicationDetail | null> {
    await Promise.resolve()
    // Swap for $fetch(`/api/teacher-applications/${id}`) when the API exists
    return MOCK_DETAIL[id] ?? null
  },

  async accept(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/teacher-applications/${id}/accept`, { method: 'POST' }) when the API exists
    console.log('Accept teacher application:', id)
  },

  async reject(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/teacher-applications/${id}/reject`, { method: 'POST' }) when the API exists
    console.log('Reject teacher application:', id)
  },
}
