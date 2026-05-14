import type { RouteLocationNormalized } from 'vue-router'
import type { Permission } from '~/types/permission'

export async function runAuthMiddleware(to: RouteLocationNormalized) {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.init()
  }

  if (to.path === '/login' && authStore.isLoggedIn) {
    return navigateTo('/')
  }

  if (to.meta.public) {
    return
  }

  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
}

export function runPermissionMiddleware(to: RouteLocationNormalized) {
  const required = to.meta.permission as Permission | Permission[] | undefined
  if (required === undefined) {
    return
  }

  const authStore = useAuthStore()
  if (!authStore.isLoggedIn) {
    return
  }

  const mode = to.meta.permissionMode ?? 'any'

  if (!authStore.hasPermission(required, mode)) {
    return navigateTo('/')
  }
}
