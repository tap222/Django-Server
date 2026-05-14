import type { IAuthRepository } from './auth.repository'
import { createMockAuthRepository } from './mock-auth.repository'

/**
 * Swap `createMockAuthRepository` for e.g. `createHttpAuthRepository` when the API exists.
 */
export function createAuthRepository(): IAuthRepository {
  return createMockAuthRepository()
}

export type { IAuthRepository } from './auth.repository'
