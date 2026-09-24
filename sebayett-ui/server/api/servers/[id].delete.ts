export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const serverId = getDiscordIdParam(event)
  if (!(await prisma.servers_servers.findUnique({ where: { server_id: serverId }, select: { server_id: true } }))) {
    throw createError({ statusCode: 404, statusMessage: 'Server not found' })
  }
  await prisma.$transaction((tx) => deleteServer(tx, serverId))
  setResponseStatus(event, 204)
  return null
})
