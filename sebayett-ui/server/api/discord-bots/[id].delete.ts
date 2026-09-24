export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { count } = await prisma.bots_bots.deleteMany({ where: { bot_id: getDiscordIdParam(event) } })
  if (!count) throw createError({ statusCode: 404, statusMessage: 'Bot not found' })
  setResponseStatus(event, 204)
  return null
})
