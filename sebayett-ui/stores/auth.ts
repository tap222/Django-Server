import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { createAuthRepository } from '~/services/auth'
import { permissionsForRole } from '~/config/role-permissions'
import type { AuthUser } from '~/types/auth'
import type { Permission } from '~/types/permission'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const initialized = ref(false)

  const isLoggedIn = computed(() => user.value !== null)

  const permissionSet = computed(() => {
    const u = user.value
    if (!u) {
      return new Set<Permission>()
    }
    return new Set<Permission>(permissionsForRole(u.role) as Permission[])
  })

  const permissions = computed(() => Array.from(permissionSet.value))

  function hasPermission(
    required: Permission | Permission[],
    mode: 'all' | 'any' = 'any',
  ): boolean {
    const set = permissionSet.value
    const list = Array.isArray(required) ? required : [required]
    if (list.length === 0) {
      return true
    }
    if (mode === 'all') {
      return list.every((p) => set.has(p))
    }
    return list.some((p) => set.has(p))
  }

  async function init() {
    if (initialized.value) {
      return
    }
    const repo = createAuthRepository()
    const session = await repo.fetchSession()
    user.value = session?.user ?? null
    initialized.value = true
  }

  /** Replace mock/API user without refetching (e.g. login form). */
  function setUser(next: AuthUser | null) {
    user.value = next
    initialized.value = true
  }

  function clearSession() {
    user.value = null
    initialized.value = true
  }

  /** Force reload from repository (e.g. after token refresh). */
  async function refreshSession() {
    const repo = createAuthRepository()
    const session = await repo.fetchSession()
    user.value = session?.user ?? null
    initialized.value = true
  }

  return {
    user,
    initialized,
    isLoggedIn,
    permissions,
    hasPermission,
    init,
    setUser,
    clearSession,
    refreshSession,
  }
})
