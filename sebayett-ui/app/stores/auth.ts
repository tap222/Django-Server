import { defineStore } from 'pinia'
import { createAuthRepository } from '~/services/auth'
import { permissionsForRole } from '~/config/role-permissions'
import type { AuthUser } from '~/types/auth'
import type { Permission } from '~/types/permission'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    initialized: false,
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    permissions: (state): readonly Permission[] =>
      state.user ? permissionsForRole(state.user.role) : [],
  },
  actions: {
    async init() {
      const session = await createAuthRepository().fetchSession()
      this.user = session?.user ?? null
      this.initialized = true
    },
    setUser(user: AuthUser | null) {
      this.user = user
      this.initialized = true
    },
    clearSession() {
      this.user = null
    },
    hasPermission(required: Permission | Permission[], mode: 'all' | 'any' = 'any'): boolean {
      const perms = this.permissions
      const list = Array.isArray(required) ? required : [required]
      return mode === 'all'
        ? list.every((p) => perms.includes(p))
        : list.some((p) => perms.includes(p))
    },
  },
})
