import { FetchError } from 'ofetch'

/**
 * `$fetch` for this app's own /api routes.
 * During SSR plain `$fetch` doesn't forward the browser's cookies, so the admin API would see
 * a logged-out request; `useRequestFetch` does. Call it inside setup / useAsyncData / a composable.
 */
export function useApiFetch() {
  return import.meta.server ? useRequestFetch() : $fetch
}

/** Resolve to null on a 404 (e.g. a detail page for something that was deleted). */
export async function orNull<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request
  } catch (error) {
    if (error instanceof FetchError && error.statusCode === 404) return null
    throw error
  }
}

/** Field errors from a 422 response ({ data: { errors: { field: message } } }). */
export function apiFieldErrors(error: unknown): Record<string, string> {
  if (error instanceof FetchError && error.statusCode === 422) {
    return error.data?.data?.errors ?? {}
  }
  return {}
}
