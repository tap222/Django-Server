import type { RouteLocationNormalized } from 'vue-router'
import { useRole } from '~/composables/useRole'
import { useAuthStore } from '~/stores/auth'
import type { AppRole } from '~/types/roles'
import type { UserRole } from '~/types/auth'

function fallbackPathForRole(role: AppRole): string {
  switch (role) {
    case 'teacher': return '/teacher/dashboard'
    case 'server':  return '/server/dashboard'
    case 'student': return '/student/dashboard'
    default:        return '/admin/dashboard'
  }
}

export function runRoleGuard(to: RouteLocationNormalized) {
  const { getRole, setRole } = useRole()
  const authStore = useAuthStore()
  const current = getRole()

  const syncStore = (role: AppRole) => {
    if (authStore.user) {
      authStore.user.role = role as UserRole
    }
  }

  // 1. Auto-switch role based on path prefix in this demo/mock app
  if (to.path.startsWith('/admin/') && current !== 'admin') {
    setRole('admin')
    syncStore('admin')
    return
  }
  if (to.path.startsWith('/teacher/') && current !== 'teacher') {
    setRole('teacher')
    syncStore('teacher')
    return
  }
  if (to.path.startsWith('/server/') && current !== 'server') {
    setRole('server')
    syncStore('server')
    return
  }
  if (to.path.startsWith('/student/') && current !== 'student') {
    setRole('student')
    syncStore('student')
    return
  }

  // 2. Explicit page-level allowedRoles check (highest priority)
  const allowed = to.meta.allowedRoles as AppRole[] | undefined
  if (allowed?.length) {
    if (allowed.includes(current)) return
    
    // If not allowed, try to go to the dashboard for their current role
    return navigateTo(fallbackPathForRole(current))
  }
}
