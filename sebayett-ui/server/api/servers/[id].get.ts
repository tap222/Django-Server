export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const s = await prisma.servers_servers.findUnique({ where: { server_id: getDiscordIdParam(event) } })
  if (!s) throw createError({ statusCode: 404, statusMessage: 'Server not found' })
  return {
    firstName: s.first_name,
    lastName: s.last_name,
    serverName: s.server_name,
    serverId: s.server_id.toString(),
    description: s.server_description,
    interests: s.server_interests,
    acceptedAt: s.created_at,
  }
})
