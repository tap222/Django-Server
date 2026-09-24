import { timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

/**
 * Only the Discord bots may call /api/bot/*: they send the shared key in `X-Bot-Key`.
 * Like the Django version, every request is refused when no key is configured.
 */
export function requireBotKey(event: H3Event) {
  const expected = useRuntimeConfig(event).botApiKey
  const given = getHeader(event, 'x-bot-key') ?? ''

  const ok = !!expected
    && given.length === expected.length
    && timingSafeEqual(Buffer.from(given), Buffer.from(expected))

  if (!ok) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid bot key' })
  }
}

/**
 * Read a parameter from the query string, falling back to a JSON body.
 * The existing bots send GET requests with a JSON body (the Django API read `request.data`).
 * Body integers come back as BigInt so Discord IDs keep full precision; query values are strings.
 */
export async function getBotParam(event: H3Event, name: string): Promise<string | number | bigint | undefined> {
  const fromQuery = getQuery(event)[name]
  if (typeof fromQuery === 'string' && fromQuery) return fromQuery

  const req = event.node.req
  if (!Number(req.headers['content-length'])) return undefined

  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  try {
    // Mark long integers before JSON.parse, which would round them to the nearest double
    const text = Buffer.concat(chunks).toString('utf8')
      .replace(/([:[,]\s*)(-?\d{16,})(?=\s*[,}\]])/g, '$1"__bigint__$2"')
    const value = JSON.parse(text)?.[name]
    if (typeof value === 'string' && value.startsWith('__bigint__')) return BigInt(value.slice(10))
    if (typeof value === 'string' || typeof value === 'number') return value === '' ? undefined : value
    return undefined
  } catch {
    return undefined
  }
}

/** Discord IDs don't fit in a JS number, so write BigInts as exact JSON integers (as Django did). */
export function sendBotJson(event: H3Event, data: unknown) {
  const json = JSON.stringify(data, (_key, value) =>
    typeof value === 'bigint' ? `__bigint__${value}__` : value,
  ).replace(/"__bigint__(-?\d+)__"/g, '$1')

  setHeader(event, 'content-type', 'application/json')
  return json
}

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

/** Postgres DATE -> "YYYY-MM-DD" and TIME -> "HH:MM:SS", matching Django's JSON output. */
export const formatDate = (d: Date | null) => d?.toISOString().slice(0, 10) ?? null
export const formatTime = (t: Date | null) => t?.toISOString().slice(11, 19) ?? null
