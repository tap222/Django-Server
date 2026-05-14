export const PERMISSIONS = [
  'dashboard.view',
  'groups.manage',
  'serverApplications.manage',
  'teacherApplications.manage',
  'discordBots.manage',
  'servers.manage',
  'teacher.manage',
  'events.view',
  'events.delete',
  'events.manage',
  'lessons.manage',
  'settings.manage',
] as const

export type Permission = (typeof PERMISSIONS)[number]

export function isPermission(value: string): value is Permission {
  return (PERMISSIONS as readonly string[]).includes(value)
}
