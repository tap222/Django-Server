import { runAuthMiddleware } from '~/utils/rbac-middleware'

export default defineNuxtRouteMiddleware(async (to) => {
  return runAuthMiddleware(to)
})
