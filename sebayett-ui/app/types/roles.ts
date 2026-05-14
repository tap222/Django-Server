export const APP_ROLES = ['admin', 'teacher', 'server', 'student'] as const

export type AppRole = (typeof APP_ROLES)[number]

export function isAppRole(value: string): value is AppRole {
  return (APP_ROLES as readonly string[]).includes(value)
}
