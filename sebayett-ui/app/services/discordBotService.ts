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
  serverId: string
  botId: string
  token: string
}

export const discordBotService = {
  async getAll(): Promise<BotRow[]> {
    const rows = await useApiFetch()<Omit<BotRow, 'action'>[]>('/api/discord-bots')
    return rows.map((b) => ({ ...b, createdAt: formatDateTime(b.createdAt), action: '' }))
  },

  async getById(id: string): Promise<BotDetail | null> {
    const bot = await orNull(useApiFetch()<BotDetail>(`/api/discord-bots/${id}`))
    return bot && { ...bot, createdAt: formatDateTime(bot.createdAt) }
  },

  async create(data: BotFormData): Promise<void> {
    await useApiFetch()('/api/discord-bots', { method: 'POST', body: data })
  },

  async update(id: string, data: BotFormData): Promise<void> {
    await useApiFetch()(`/api/discord-bots/${id}`, { method: 'PATCH', body: data })
  },

  async deleteBot(id: string): Promise<void> {
    await useApiFetch()(`/api/discord-bots/${id}`, { method: 'DELETE' })
  },
}
