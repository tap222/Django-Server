import { storeToRefs } from 'pinia'
import type { Permission } from '~/types/permission'

export function usePermission() {
  const authStore = useAuthStore()
  const { permissions } = storeToRefs(authStore)

  function can(
    required: Permission | Permission[],
    mode: 'all' | 'any' = 'any',
  ): boolean {
    return authStore.hasPermission(required, mode)
  }

  return {
    can,
    permissions,
  }
}
