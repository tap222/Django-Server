export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const bot = await prisma.bots_bots.findUnique({
    where: { bot_id: getDiscordIdParam(event) },
    include: { servers_servers: { select: { server_name: true } } },
  })
  if (!bot) throw createError({ statusCode: 404, statusMessage: 'Bot not found' })
  return toBotDto(bot)
})
