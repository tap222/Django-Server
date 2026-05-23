import type { IAuthRepository } from './auth.repository'
import { createMockAuthRepository } from './mock-auth.repository'
import { createHttpAuthRepository } from './http-auth.repository'

/**
 * Swap `createMockAuthRepository` for e.g. `createHttpAuthRepository` when the API exists.
 */
export function createAuthRepository(): IAuthRepository {
  //return createMockAuthRepository()
  return createHttpAuthRepository()
}

export type { IAuthRepository } from './auth.repository'
