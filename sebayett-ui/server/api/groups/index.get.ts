export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const groups = await prisma.auth_group.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { auth_user_groups: true, auth_group_permissions: true } } },
  })
  return groups.map((g) => ({
    name: g.name,
    slug: groupSlug(g.name),
    userCount: g._count.auth_user_groups,
    permissionCount: g._count.auth_group_permissions,
    builtIn: BUILT_IN_GROUPS.includes(g.name),
  }))
})
