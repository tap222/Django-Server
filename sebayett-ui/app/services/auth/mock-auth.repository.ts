import type { IAuthRepository } from './auth.repository'
import type { AuthSession, AuthUser, UserRole } from '~/types/auth'
import { isUserRole } from '~/types/auth'

export function createMockAuthUser(role: UserRole): AuthUser {
  return {
    id: 'mock-user-1',
    email: 'mock@example.com',
    displayName: 'Mock User',
    role,
  }
}

/**
 * Replace with an HTTP-backed implementation that returns the same `AuthUser` shape.
 */
export function createMockAuthRepository(): IAuthRepository {
  return {
    async fetchSession(): Promise<AuthSession | null> {
      const config = useRuntimeConfig()
      const raw = config.public.mockUserRole
      const role: UserRole = typeof raw === 'string' && isUserRole(raw) ? raw : 'admin'

      return { user: createMockAuthUser(role) }
    },
  }
}
