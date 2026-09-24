// Stream bot credentials for a server. Port of Django `api/events/streamer/`.
export default defineEventHandler(async (event) => {
  requireBotKey(event)

  const serverIdParam = await getBotParam(event, 'server_id')
  if (!serverIdParam) {
    setResponseStatus(event, 204)
    return null
  }
  const serverId = parseDiscordId(serverIdParam)

  const bot = await prisma.bots_bots.findFirst({
    where: { server_id: serverId },
    select: { bot_id: true, bot_self_token: true },
  })
  // Server has no self bot
  if (!bot) {
    setResponseStatus(event, 204)
    return null
  }

  return sendBotJson(event, {
    // Echo the ID the way it was sent (string from the query, integer from a JSON body), like Django
    server_id: serverIdParam,
    bot_id: bot.bot_id,
    bot_self_token: bot.bot_self_token,
  })
})
