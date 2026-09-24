export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const servers = await prisma.servers_servers.findMany({ orderBy: { created_at: 'desc' } })
  return servers.map((s) => ({
    serverId: s.server_id.toString(),
    serverName: s.server_name,
    serverInterests: s.server_interests,
    serverDescription: s.server_description,
    joined: s.created_at,
  }))
})
