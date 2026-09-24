export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const group = await findGroupBySlug(getRouterParam(event, 'slug') ?? '')
  if (BUILT_IN_GROUPS.includes(group.name)) {
    throw createError({ statusCode: 409, statusMessage: `The ${group.name} role is built in and can't be deleted` })
  }
  await prisma.$transaction([
    prisma.auth_user_groups.deleteMany({ where: { group_id: group.id } }),
    prisma.auth_group_permissions.deleteMany({ where: { group_id: group.id } }),
    prisma.auth_group.delete({ where: { id: group.id } }),
  ])
  setResponseStatus(event, 204)
  return null
})
