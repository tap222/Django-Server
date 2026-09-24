import type { H3Event } from 'h3'

export function parseDiscordId(value: string | number | bigint): bigint {
  if (!/^\d{1,20}$/.test(String(value))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Discord ID' })
  }
  return BigInt(String(value))
}

const UUID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i

export function parseUuid(value: string | number | bigint): string {
  if (!UUID.test(String(value))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid UUID' })
  }
  return String(value)
}

export function getDiscordIdParam(event: H3Event, name = 'id'): bigint {
  return parseDiscordId(getRouterParam(event, name) ?? '')
}

export function getUuidParam(event: H3Event, name = 'id'): string {
  return parseUuid(getRouterParam(event, name) ?? '')
}

/** Postgres DATE -> "YYYY-MM-DD" and TIME -> "HH:MM:SS", matching Django's JSON output. */
export const formatDate = (d: Date | null) => d?.toISOString().slice(0, 10) ?? null
export const formatTime = (t: Date | null) => t?.toISOString().slice(11, 19) ?? null
