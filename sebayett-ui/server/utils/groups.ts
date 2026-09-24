/** Roles the app depends on (see users/signals.py and role-permissions.ts); these can't be deleted. */
export const BUILT_IN_GROUPS = ['Admin', 'Server', 'Teacher', 'Student']

export const groupSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export async function findGroupBySlug(slug: string) {
  const groups = await prisma.auth_group.findMany()
  const group = groups.find((g) => groupSlug(g.name) === slug)
  if (!group) throw createError({ statusCode: 404, statusMessage: 'Group not found' })
  return group
}
