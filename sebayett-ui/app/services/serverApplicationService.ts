export interface ServerApplicationRow {
  firstName: string
  lastName: string
  serverName: string
  serverId: string
  status: 'Pending' | 'Accepted' | 'Rejected'
  action: string
}

export interface ServerApplicationDetail {
  firstName: string
  lastName: string
  serverName: string
  serverId: string
  serverDescription: string
  serverInterests: string
}

type ServerApplicationRowDto = Omit<ServerApplicationRow, 'action' | 'status'> & { status: string }

export const serverApplicationService = {
  async getAll(): Promise<ServerApplicationRow[]> {
    const rows = await useApiFetch()<ServerApplicationRowDto[]>('/api/server-applications')
    return rows.map((a) => ({ ...a, status: capitalize(a.status) as ServerApplicationRow['status'], action: '' }))
  },

  async getById(id: string): Promise<ServerApplicationDetail | null> {
    return orNull(useApiFetch()<ServerApplicationDetail>(`/api/server-applications/${id}`))
  },

  async accept(id: string): Promise<void> {
    await useApiFetch()(`/api/server-applications/${id}/accept`, { method: 'POST' })
  },

  async reject(id: string): Promise<void> {
    await useApiFetch()(`/api/server-applications/${id}/reject`, { method: 'POST' })
  },
}
