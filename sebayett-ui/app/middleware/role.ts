import { runRoleGuard } from '~/utils/role-middleware'

/** Named middleware: same behavior as `role.global` (optional explicit `definePageMeta` chain). */
export default defineNuxtRouteMiddleware((to) => {
  return runRoleGuard(to)
})
