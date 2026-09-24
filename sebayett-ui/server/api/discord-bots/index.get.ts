export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const bots = await prisma.bots_bots.findMany({
    orderBy: { created_at: 'desc' },
    include: { servers_servers: { select: { server_name: true } } },
  })
  // The list never needs the full self token
  return bots.map((b) => ({ ...toBotDto(b), token: maskToken(b.bot_self_token) }))
})
