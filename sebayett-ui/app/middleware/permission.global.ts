import { runPermissionMiddleware } from '~/utils/rbac-middleware'

export default defineNuxtRouteMiddleware((to) => {
  return runPermissionMiddleware(to)
})
