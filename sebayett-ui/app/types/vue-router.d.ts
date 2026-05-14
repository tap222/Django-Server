import type { Permission } from './permission'
import type { AppRole } from './roles'

declare module 'vue-router' {
  interface RouteMeta {
    /** When true, auth global middleware skips login redirect (e.g. /login). */
    public?: boolean
    /** Required permission(s) for this route; enforced by permission global middleware. */
    permission?: Permission | Permission[]
    /** How to evaluate `permission` when it is an array. Default: `any`. */
    permissionMode?: 'any' | 'all'
    /** If set, role global middleware restricts this route to these app roles (sidebar RBAC). */
    allowedRoles?: AppRole[]
  }
}

export {}
