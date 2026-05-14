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

const MOCK_LIST: ServerApplicationRow[] = [
  { firstName: 'John', lastName: 'Wick', serverName: "John's Server", serverId: '123456789526525879', status: 'Pending', action: '' },
  { firstName: 'Derrick', lastName: 'Michael', serverName: "Derrick's Server", serverId: '952652587912345678', status: 'Accepted', action: '' },
  { firstName: 'Achraf', lastName: 'Khadraoui', serverName: "Achraf's Server", serverId: '789526512345625879', status: 'Rejected', action: '' },
]

const MOCK_DETAIL: Record<string, ServerApplicationDetail> = {
  '123456789526525879': { firstName: 'John', lastName: 'Wick', serverName: "John's Server", serverId: '123456789526525879', serverDescription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.', serverInterests: 'Testing' },
  '952652587912345678': { firstName: 'Derrick', lastName: 'Michael', serverName: "Derrick's Server", serverId: '952652587912345678', serverDescription: 'Derrick Michael\'s private server for educational purposes and community events.', serverInterests: 'Music, Education, Community' },
  '789526512345625879': { firstName: 'Achraf', lastName: 'Khadraoui', serverName: "Achraf's Server", serverId: '789526512345625879', serverDescription: 'Achraf\'s gaming and development community server for high-performance applications.', serverInterests: 'Gaming, Development, Performance' },
}

export const serverApplicationService = {
  async getAll(): Promise<ServerApplicationRow[]> {
    await Promise.resolve()
    // Swap for $fetch('/api/server-applications') when the API exists
    return MOCK_LIST
  },

  async getById(id: string): Promise<ServerApplicationDetail | null> {
    await Promise.resolve()
    // Swap for $fetch(`/api/server-applications/${id}`) when the API exists
    return MOCK_DETAIL[id] ?? null
  },

  async accept(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/server-applications/${id}/accept`, { method: 'POST' }) when the API exists
    console.log('Accept server application:', id)
  },

  async reject(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/server-applications/${id}/reject`, { method: 'POST' }) when the API exists
    console.log('Reject server application:', id)
  },
}
