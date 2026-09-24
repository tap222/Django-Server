export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const serverId = getDiscordIdParam(event)

  await prisma.$transaction(async (tx) => {
    if (!(await tx.servers_server_applications.findUnique({ where: { server_id: serverId }, select: { server_id: true } }))) {
      throw createError({ statusCode: 404, statusMessage: 'Application not found' })
    }
    await archiveServerApplication(tx, serverId, 'rejected')
  })

  return { status: 'success', message: 'Application rejected' }
})
