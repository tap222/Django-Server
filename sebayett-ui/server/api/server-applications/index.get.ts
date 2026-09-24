export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const apps = await prisma.servers_server_applications.findMany({ orderBy: { created_at: 'desc' } })
  return apps.map((a) => ({
    firstName: a.first_name,
    lastName: a.last_name,
    serverName: a.server_name,
    serverId: a.server_id.toString(),
    status: a.status,
  }))
})
