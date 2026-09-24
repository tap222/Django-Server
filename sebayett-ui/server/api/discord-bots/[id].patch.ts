export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const botId = getDiscordIdParam(event)
  if (!(await prisma.bots_bots.findUnique({ where: { bot_id: botId }, select: { bot_id: true } }))) {
    throw createError({ statusCode: 404, statusMessage: 'Bot not found' })
  }
  const input = await validateBotInput(await readBody(event), botId)
  const bot = await prisma.bots_bots.update({
    where: { bot_id: botId },
    data: { bot_id: input.botId, server_id: input.serverId, bot_self_token: input.token, updated_at: new Date() },
    include: { servers_servers: { select: { server_name: true } } },
  })
  return toBotDto(bot)
})
