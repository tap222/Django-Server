import { runAuthMiddleware } from '~/utils/rbac-middleware'

/** Named middleware: same behavior as `auth.global` (use in `definePageMeta` when documenting the chain). */
export default defineNuxtRouteMiddleware(async (to) => {
  return runAuthMiddleware(to)
})
