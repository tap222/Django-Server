export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const a = await prisma.servers_server_applications.findUnique({ where: { server_id: getDiscordIdParam(event) } })
  if (!a) throw createError({ statusCode: 404, statusMessage: 'Application not found' })
  return {
    firstName: a.first_name,
    lastName: a.last_name,
    serverName: a.server_name,
    serverId: a.server_id.toString(),
    serverDescription: a.server_description,
    serverInterests: a.server_interests,
  }
})
