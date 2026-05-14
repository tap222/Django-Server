import type { AuthSession } from '~/types/auth'

export interface IAuthRepository {
  fetchSession(): Promise<AuthSession | null>
}
