import type { UserRole } from '~/types/auth'
import type { Permission } from '~/types/permission'

const allPermissions: readonly Permission[] = [
  'dashboard.view',
  'groups.manage',
  'serverApplications.manage',
  'teacherApplications.manage',
  'discordBots.manage',
  'servers.manage',
  'teacher.manage',
  'events.manage',
  'lessons.manage',
  'settings.manage',
]

/**
 * Single source of truth: role → permissions. UI and routes never branch on role.
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  admin: allPermissions,
  teacher: [
    'dashboard.view',
    'teacher.manage',
    'events.view',
    'events.manage',
    'lessons.manage',
    'settings.manage',
  ],
  server: [
    'dashboard.view',
    'servers.manage',
    'serverApplications.manage',
    'discordBots.manage',
    'events.view',
    'events.manage',
  ],
  student: ['dashboard.view', 'lessons.manage', 'events.view', 'settings.manage'],
}

export function permissionsForRole(role: UserRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role]
}
