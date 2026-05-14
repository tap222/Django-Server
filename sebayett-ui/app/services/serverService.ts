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

const MOCK_LIST: ServerRow[] = [
  { serverId: '1249837877257441331', serverName: "The People's Perspective", serverInterests: 'Politics and history', serverDescription: 'test server', joined: 'Oct. 28, 2025, 2:59 p.m.', action: '' },
  { serverId: '1481152770039087230', serverName: "Kajal's server", serverInterests: 'designs', serverDescription: 'test dashboard to design', joined: 'March 19, 2026, 2:34 p.m.', action: '' },
]

const MOCK_DETAIL: Record<string, ServerDetail> = {
  '1249837877257441331': { firstName: 'John', lastName: 'Wick', serverName: "The People's Perspective", serverId: '1249837877257441331', description: 'test server', interests: 'Politics and history', acceptedAt: 'Oct. 28, 2025, 2:59 p.m.' },
  '1481152770039087230': { firstName: 'Kajal', lastName: 'Patel', serverName: "Kajal's server", serverId: '1481152770039087230', description: 'test dashboard to design', interests: 'designs', acceptedAt: 'March 19, 2026, 2:34 p.m.' },
}

export const serverService = {
  async getAll(): Promise<ServerRow[]> {
    await Promise.resolve()
    // Swap for $fetch('/api/servers') when the API exists
    return MOCK_LIST
  },

  async getById(id: string): Promise<ServerDetail | null> {
    await Promise.resolve()
    // Swap for $fetch(`/api/servers/${id}`) when the API exists
    return MOCK_DETAIL[id] ?? null
  },

  async deleteServer(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/servers/${id}`, { method: 'DELETE' }) when the API exists
    console.log('Delete server:', id)
  },
}
