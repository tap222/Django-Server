import { runPermissionMiddleware } from '~/utils/rbac-middleware'

/** Named middleware: same behavior as `permission.global` (use in `definePageMeta` when documenting the chain). */
export default defineNuxtRouteMiddleware((to) => {
  return runPermissionMiddleware(to)
})
