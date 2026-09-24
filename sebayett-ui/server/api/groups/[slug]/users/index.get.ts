export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const group = await findGroupBySlug(getRouterParam(event, 'slug') ?? '')
  const users = await prisma.auth_user.findMany({
    where: { auth_user_groups: { some: { group_id: group.id } } },
    orderBy: { date_joined: 'desc' },
    select: { id: true, username: true, date_joined: true, auth_user_groups: { select: { auth_group: { select: { name: true } } } } },
  })
  return users.map((u) => ({
    id: u.id,
    name: u.username,
    roles: u.auth_user_groups.map((ug) => ug.auth_group.name),
    joinedAt: u.date_joined,
  }))
})
