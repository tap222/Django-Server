import { computed } from 'vue'
import type { AppRole } from '~/types/roles'

const ROLE_STATE_KEY = 'app-current-role'

/**
 * Mock app role (admin vs teacher). Replace internals later with API/session
 * without changing consumers (Sidebar stays dumb; layout passes filtered menus).
 */
export function useRole() {
  const config = useRuntimeConfig()
  const defaultRole = (config.public.mockUserRole as AppRole) || 'admin'
  const role = useState<AppRole>(ROLE_STATE_KEY, () => defaultRole)

  function getRole(): AppRole {
    return role.value
  }

  function setRole(next: AppRole) {
    role.value = next
  }

  /** Whether the current role is allowed for a menu item's `roles` array. */
  function hasAccess(menuRoles: AppRole[]): boolean {
    return menuRoles.includes(role.value)
  }

  const isAdmin = computed(() => role.value === 'admin')
  const isTeacher = computed(() => role.value === 'teacher')
  const isServer = computed(() => role.value === 'server')
  const isStudent = computed(() => role.value === 'student')
  return {
    role,
    getRole,
    setRole,
    hasAccess,
    isAdmin,
    isTeacher,
    isServer,
    isStudent,
  }
}
