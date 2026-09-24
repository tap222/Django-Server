export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const input = await validateBotInput(await readBody(event))
  const now = new Date()
  const bot = await prisma.bots_bots.create({
    data: { bot_id: input.botId, server_id: input.serverId, bot_self_token: input.token, created_at: now, updated_at: now },
    include: { servers_servers: { select: { server_name: true } } },
  })
  setResponseStatus(event, 201)
  return toBotDto(bot)
})
