import type { IAuthRepository } from './auth.repository'
import type { AuthSession, AuthUser, UserRole } from '~/types/auth'
import { isUserRole } from '~/types/auth'

function mapDjangoUserToAuthUser(djangoUser: any): AuthUser {
  // Map your Django user object to AuthUser
  // Adjust based on what your Django API returns
  const group: string | undefined = djangoUser.groups?.[0]?.name?.toLowerCase()
  const role: UserRole = group ?? (djangoUser.is_superuser ? 'admin' : 'student')
  return {
    id: String(djangoUser.id),
    email: djangoUser.email,
    displayName: djangoUser.first_name && djangoUser.last_name
      ? `${djangoUser.first_name} ${djangoUser.last_name}`
      : djangoUser.username,
    role: isUserRole(role) ? role : 'student',
  }
}

function readCookie(name: string): string | undefined {
  if (import.meta.server) return undefined
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')[1]
}

export function createHttpAuthRepository(): IAuthRepository {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  // During SSR the browser isn't making the request, so pass its cookies (incl. Django's sessionid) along
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  return {
    async fetchSession(): Promise<AuthSession | null> {
      try {
        // Get current authenticated user from Django
        const user = await $fetch(`${apiBase}users/api/me/`, {
          method: 'GET',
          credentials: 'include', // Send cookies for session auth
          headers,
        })

        if (!user) return null

        return { user: mapDjangoUserToAuthUser(user) }
      } catch (error) {
        // Not authenticated
        return null
      }
    },

    async logout(): Promise<void> {
      await $fetch(`${apiBase}users/api/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRFToken': readCookie('csrftoken') ?? '' },
      })
    },
  }
}
