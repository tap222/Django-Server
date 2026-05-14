export interface BotRow {
  botId: string
  serverId: string
  server: string
  token: string
  createdAt: string
  action: string
}

export interface BotDetail {
  botId: string
  serverId: string
  server: string
  token: string
  createdAt: string
}

export interface BotFormData {
  server: string
  botId: string
  token: string
}

const MOCK_LIST: BotRow[] = [
  { botId: '1215231122141412565', serverId: '1249837877257441331', server: "The People's Perspective", token: 'MTIyNDk1NzE5Njg0...', createdAt: 'March 29, 2026, 5:22 p.m.', action: '' },
  { botId: '9988776655443322110', serverId: '1122334455667788990', server: 'Study Group Alpha', token: 'ODk4NzY1NDMyMTA5...', createdAt: 'April 2, 2026, 10:15 a.m.', action: '' },
  { botId: '5544332211009988776', serverId: '6677889900112233445', server: 'Community Events', token: 'NTU0NDMzMjIxMTAw...', createdAt: 'April 10, 2026, 3:45 p.m.', action: '' },
]

const MOCK_DETAIL: Record<string, BotDetail> = {
  '1215231122141412565': { botId: '1215231122141412565', serverId: '1249837877257441331', server: "The People's Perspective", token: 'MTIyNDk1NzE5Njg0NTA2NTA2NG5nOGJhMDAwNzk5Y2M0Y2E0N2QxN2E2Y2QxNTE3Y2EwM2Q2M2M0YWQ2', createdAt: 'March 29, 2026, 5:22 p.m.' },
  '9988776655443322110': { botId: '9988776655443322110', serverId: '1122334455667788990', server: 'Study Group Alpha', token: 'ODk4NzY1NDMyMTA5ODc2NTQzMjEwYWFhYmJiY2NjZGRkZWVlZmZmMTExMjIyMzMzNDQ0NTU1NjY2', createdAt: 'April 2, 2026, 10:15 a.m.' },
  '5544332211009988776': { botId: '5544332211009988776', serverId: '6677889900112233445', server: 'Community Events', token: 'NTU0NDMzMjIxMTAwOTk4ODc3NjY1NTQ0MzMyMjExMDA5OTg4Nzc2NjU1NDQzMzIyMTEwMDk5ODg3', createdAt: 'April 10, 2026, 3:45 p.m.' },
}

export const AVAILABLE_SERVERS = ["The People's Perspective", 'Another Server']

export const discordBotService = {
  async getAll(): Promise<BotRow[]> {
    await Promise.resolve()
    // Swap for $fetch('/api/discord-bots') when the API exists
    return MOCK_LIST
  },

  async getById(id: string): Promise<BotDetail | null> {
    await Promise.resolve()
    // Swap for $fetch(`/api/discord-bots/${id}`) when the API exists
    return MOCK_DETAIL[id] ?? null
  },

  async create(data: BotFormData): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch('/api/discord-bots', { method: 'POST', body: data }) when the API exists
    console.log('Create bot:', data)
  },

  async update(id: string, data: BotFormData): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/discord-bots/${id}`, { method: 'PATCH', body: data }) when the API exists
    console.log('Update bot:', id, data)
  },

  async deleteBot(id: string): Promise<void> {
    await Promise.resolve()
    // Swap for $fetch(`/api/discord-bots/${id}`, { method: 'DELETE' }) when the API exists
    console.log('Delete bot:', id)
  },
}
