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

interface GroupDto {
  name: string
  slug: string
  userCount: number
  permissionCount: number
  builtIn: boolean
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

export const groupService = {
  async getAll(): Promise<GroupRow[]> {
    const groups = await useApiFetch()<GroupDto[]>('/api/groups')
    return groups.map((g) => ({
      name: g.name,
      slug: g.slug,
      permission: g.name === 'Admin' ? 'All' : plural(g.permissionCount, 'permission'),
      users: plural(g.userCount, 'user'),
      action: '',
    }))
  },

  async getUsersByRole(slug: string): Promise<UserRole[]> {
    const users = await useApiFetch()<Omit<UserRole, 'action'>[]>(`/api/groups/${slug}/users`)
    return users.map((u) => ({ ...u, joinedAt: formatDateTime(u.joinedAt), action: '' }))
  },

  async deleteGroup(slug: string): Promise<void> {
    await useApiFetch()(`/api/groups/${slug}`, { method: 'DELETE' })
  },

  async revokeRole(userId: number, roleSlug: string): Promise<void> {
    await useApiFetch()(`/api/groups/${roleSlug}/users/${userId}`, { method: 'DELETE' })
  },
}
