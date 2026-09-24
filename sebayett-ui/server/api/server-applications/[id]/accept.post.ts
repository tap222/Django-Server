// Port of Django AdminDashboardServerApplications.accept_application
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const serverId = getDiscordIdParam(event)

  await prisma.$transaction(async (tx) => {
    const app = await tx.servers_server_applications.findUnique({ where: { server_id: serverId } })
    if (!app) throw createError({ statusCode: 404, statusMessage: 'Application not found' })
    if (!app.user_id) throw createError({ statusCode: 409, statusMessage: 'Application has no user' })
    if (await tx.servers_servers.findUnique({ where: { server_id: serverId }, select: { server_id: true } })) {
      throw createError({ statusCode: 409, statusMessage: 'Server already exists' })
    }

    const now = new Date()
    await tx.servers_servers.create({
      data: {
        server_id: app.server_id,
        user_id: app.user_id,
        first_name: app.first_name,
        last_name: app.last_name,
        server_name: app.server_name,
        server_description: app.server_description,
        server_interests: app.server_interests,
        created_at: now,
        updated_at: now,
      },
    })
    await addUserToGroup(tx, app.user_id, 'Server')
    await archiveServerApplication(tx, serverId, 'accepted')
  })

  return { status: 'success', message: 'Application accepted' }
})
