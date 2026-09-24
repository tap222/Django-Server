export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const group = await findGroupBySlug(getRouterParam(event, 'slug') ?? '')
  const userId = Number(getRouterParam(event, 'userId'))
  if (!Number.isInteger(userId)) throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' })
  // Don't let an admin lock themselves out
  if (group.name === 'Admin' && userId === admin.id) {
    throw createError({ statusCode: 409, statusMessage: "You can't remove your own Admin role" })
  }
  await prisma.auth_user_groups.deleteMany({ where: { user_id: userId, group_id: group.id } })
  setResponseStatus(event, 204)
  return null
})
