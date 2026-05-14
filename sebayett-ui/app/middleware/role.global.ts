import { runRoleGuard } from '~/utils/role-middleware'

export default defineNuxtRouteMiddleware((to) => {
  return runRoleGuard(to)
})
