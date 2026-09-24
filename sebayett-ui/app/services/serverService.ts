export interface ServerRow {
  serverId: string
  serverName: string
  serverInterests: string
  serverDescription: string
  joined: string
  action: string
}

export interface ServerDetail {
  firstName: string
  lastName: string
  serverName: string
  serverId: string
  description: string
  interests: string
  acceptedAt: string
}

type ServerRowDto = Omit<ServerRow, 'action'>

export const serverService = {
  async getAll(): Promise<ServerRow[]> {
    const rows = await useApiFetch()<ServerRowDto[]>('/api/servers')
    return rows.map((s) => ({ ...s, joined: formatDateTime(s.joined), action: '' }))
  },

  async getById(id: string): Promise<ServerDetail | null> {
    const server = await orNull(useApiFetch()<ServerDetail>(`/api/servers/${id}`))
    return server && { ...server, acceptedAt: formatDateTime(server.acceptedAt) }
  },

  async deleteServer(id: string): Promise<void> {
    await useApiFetch()(`/api/servers/${id}`, { method: 'DELETE' })
  },
}
