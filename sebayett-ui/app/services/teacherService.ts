export interface TeacherRow {
  id: string
  firstName: string
  lastName: string
  expertise: string
  gender: string
  dob: string
  action: string
}

const MOCK_LIST: TeacherRow[] = [
  { id: '5f7f43be-747a-4088-88bf-87d6524f998e', firstName: 'Derrick', lastName: 'McMichael', expertise: 'Math', gender: 'Male', dob: 'April 26, 1967', action: '' },
  { id: 'f2d8a54f-9f7c-4f41-8ab7-3f0f8d0f4f9a', firstName: 'Achraf', lastName: 'Khadraoui', expertise: 'Cybersecurity', gender: 'Male', dob: 'Sept. 19, 2000', action: '' },
  { id: '00fcb577-b1f8-4b7a-bf5b-2bdc64c2f7e0', firstName: 'Liam', lastName: "O'Shea", expertise: 'I jork it hard', gender: 'Other', dob: 'Jan. 30, 2006', action: '' },
  { id: 'a12285fb-8fdc-42bd-b871-5918e90ad1f2', firstName: 'Kajal', lastName: 'Patel', expertise: 'Dev', gender: 'Female', dob: 'March 7, 1992', action: '' },
]

export const teacherService = {
  async getAll(): Promise<TeacherRow[]> {
    await Promise.resolve()
    // Swap for $fetch('/api/teachers') when the API exists
    return MOCK_LIST
  },

  async deleteTeacher(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/teachers/${id}`, { method: 'DELETE' }) when the API exists
    console.log('Delete teacher:', id)
  },
}
