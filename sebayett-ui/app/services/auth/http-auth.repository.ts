import type { IAuthRepository } from './auth.repository'
import type { AuthSession, AuthUser, UserRole } from '~/types/auth'
import { isUserRole } from '~/types/auth'

function mapDjangoUserToAuthUser(djangoUser: any): AuthUser {
  // Map your Django user object to AuthUser
  // Adjust based on what your Django API returns
  const role: UserRole = djangoUser.groups?.[0]?.name?.toLowerCase() || 'student'
  return {
    id: String(djangoUser.id),
    email: djangoUser.email,
    displayName: djangoUser.first_name && djangoUser.last_name
      ? `${djangoUser.first_name} ${djangoUser.last_name}`
      : djangoUser.username,
    role: isUserRole(role) ? role : 'student',
  }
}

export function createHttpAuthRepository(): IAuthRepository {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  return {
    async fetchSession(): Promise<AuthSession | null> {
      try {
        // Get current authenticated user from Django
        const user = await $fetch(`${apiBase}user/me`, {
          method: 'GET',
          credentials: 'include', // Send cookies for session auth
        })

        if (!user) return null

        return { user: mapDjangoUserToAuthUser(user) }
      } catch (error) {
        // Not authenticated
        return null
      }
    },
  }
}
