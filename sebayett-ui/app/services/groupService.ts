export interface GroupRow {
  name: string
  permission: string
  users: string
  action: string
  slug: string
}

export interface UserRole {
  id: number
  name: string
  roles: string[]
  joinedAt: string
  action: string
}

const MOCK_GROUPS: GroupRow[] = [
  { name: 'Admin', permission: 'All', users: '5 users', action: '', slug: 'admin' },
  { name: 'Server', permission: 'All', users: '3 users', action: '', slug: 'server' },
  { name: 'Teacher', permission: 'Limited', users: '8 users', action: '', slug: 'teacher' },
]

const MOCK_USERS_BY_ROLE: Record<string, UserRole[]> = {
  admin: [
    { id: 1, name: 'Derrick McMichael', roles: ['Admin'], joinedAt: 'April 26, 2025', action: '' },
    { id: 2, name: 'Achraf Ben', roles: ['Admin', 'Server'], joinedAt: 'April 25, 2025', action: '' },
    { id: 3, name: 'Liam Chen', roles: ['Admin'], joinedAt: 'April 24, 2025', action: '' },
    { id: 4, name: 'Sarah Johnson', roles: ['Admin', 'Teacher'], joinedAt: 'April 23, 2025', action: '' },
    { id: 5, name: 'Michael Davis', roles: ['Admin'], joinedAt: 'April 22, 2025', action: '' },
  ],
  server: [
    { id: 2, name: 'Achraf Ben', roles: ['Admin', 'Server'], joinedAt: 'April 25, 2025', action: '' },
  ],
  teacher: [
    { id: 4, name: 'Sarah Johnson', roles: ['Admin', 'Teacher'], joinedAt: 'April 23, 2025', action: '' },
  ],
}


export const groupService = {

  async getAll(): Promise<GroupRow[]> {
    await Promise.resolve()
    // Swap for $fetch('/api/groups') when the API exists
    const response = await $fetch<GroupRow[]>(`${apiBase}dashboard/admin/groups/`)
    return response
  },

  async getUsersByRole(slug: string): Promise<UserRole[]> {
    await Promise.resolve()
    // Swap for $fetch(`/api/groups/${slug}/users`) when the API exists
    return MOCK_USERS_BY_ROLE[slug] ?? []
  },

  async deleteGroup(slug: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/groups/${slug}`, { method: 'DELETE' }) when the API exists
    console.log('Delete group:', slug)
  },

  async revokeRole(userId: number, roleSlug: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/groups/${roleSlug}/users/${userId}`, { method: 'DELETE' }) when the API exists
    console.log('Revoke role:', roleSlug, 'from user:', userId)
  },
}
