import { runAuthMiddleware } from '~/utils/rbac-middleware'

export default defineNuxtRouteMiddleware(async (to) => {
  await runAuthMiddleware(to)
})
