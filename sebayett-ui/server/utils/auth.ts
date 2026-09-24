import type { H3Event } from 'h3'

export interface SessionUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_superuser: boolean
  groups: { name: string }[]
}

/**
 * The logged-in user, or null.
 * Login still lives in Django (allauth + Discord), so for now we ask Django who owns the
 * session cookie. This is the only place that needs to change when auth moves to Nuxt.
 */
export async function getSessionUser(event: H3Event): Promise<SessionUser | null> {
  if (event.context.sessionUser !== undefined) return event.context.sessionUser

  const cookie = getHeader(event, 'cookie')
  let user: SessionUser | null = null
  if (cookie) {
    try {
      user = await $fetch<SessionUser>(`${useRuntimeConfig(event).public.apiBase}users/api/me/`, {
        headers: { cookie },
      })
    } catch (error: any) {
      const status = error?.response?.status
      if (status !== 401 && status !== 403) {
        throw createError({ statusCode: 502, statusMessage: 'Auth service unavailable' })
      }
    }
  }

  event.context.sessionUser = user
  return user
}

/** Same rule as Django's dashboard: member of the "Admin" group (superusers too). */
export async function requireAdmin(event: H3Event): Promise<SessionUser> {
  const user = await getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Not logged in' })
  }
  if (!user.is_superuser && !user.groups.some((g) => g.name === 'Admin')) {
    throw createError({ statusCode: 403, statusMessage: 'Admins only' })
  }
  return user
}
