import type { Permission } from './permission'
import type { AppRole } from './roles'

declare module 'nuxt/schema' {
  interface PageMeta {
    public?: boolean
    permission?: Permission | Permission[]
    permissionMode?: 'any' | 'all'
    allowedRoles?: AppRole[]
  }
}

export {}
