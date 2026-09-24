import type { Prisma } from '../generated/prisma/client'

export interface BotInput {
  serverId: string
  botId: string
  token: string
}

/** Validation from Django's bots/forms.py AddBot. `currentBotId` is set when editing. */
export async function validateBotInput(body: Partial<BotInput> | undefined, currentBotId?: bigint) {
  const errors: Record<string, string> = {}
  const serverId = String(body?.serverId ?? '').trim()
  const botId = String(body?.botId ?? '').trim()
  const token = String(body?.token ?? '').trim()

  if (!/^\d{18,20}$/.test(botId)) errors.botId = 'Bot ID must be between 18 and 20 digits.'
  if (token.length !== 61 && token.length !== 72) errors.token = 'Self token must be either 61 or 72 characters.'
  if (!/^\d{1,20}$/.test(serverId)) errors.server = 'Please select a server from the list.'

  if (!errors.server && !(await prisma.servers_servers.findUnique({ where: { server_id: BigInt(serverId) }, select: { server_id: true } }))) {
    errors.server = 'Server not found.'
  }

  const notSelf: Prisma.bots_botsWhereInput = currentBotId === undefined ? {} : { NOT: { bot_id: currentBotId } }
  if (!errors.botId && (await prisma.bots_bots.findFirst({ where: { bot_id: BigInt(botId), ...notSelf } }))) {
    errors.botId = 'A bot with this ID already exists.'
  }
  if (!errors.token && (await prisma.bots_bots.findFirst({ where: { bot_self_token: token, ...notSelf } }))) {
    errors.token = 'This self token is already in use.'
  }
  // One self bot per server: the bot API returns a server's first bot
  if (!errors.server && (await prisma.bots_bots.findFirst({ where: { server_id: BigInt(serverId), ...notSelf } }))) {
    errors.server = 'This server already has a bot.'
  }

  if (Object.keys(errors).length) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid bot', data: { errors } })
  }
  return { serverId: BigInt(serverId), botId: BigInt(botId), token }
}

export function toBotDto(bot: { bot_id: bigint, server_id: bigint, bot_self_token: string, created_at: Date, servers_servers: { server_name: string } }) {
  return {
    botId: bot.bot_id.toString(),
    serverId: bot.server_id.toString(),
    server: bot.servers_servers.server_name,
    token: bot.bot_self_token,
    createdAt: bot.created_at,
  }
}

export const maskToken = (token: string) => `${token.slice(0, 16)}...`
