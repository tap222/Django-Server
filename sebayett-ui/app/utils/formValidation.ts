/**
 * Pure frontend validators. Each returns `null` when valid, otherwise a user-facing message.
 */

import { dateOnlyCompare, parseIsoDate } from '@/components/common/datePickerCalendar'
import { AVAILABLE_SERVERS } from '@/services/discordBotService'

export type StringValidator = (value: string) => string | null

/** Trim and treat empty / whitespace-only as invalid. */
export function trimmedRequired(message = 'This field is required.'): StringValidator {
  return (value) => {
    if (value.trim() === '') return message
    return null
  }
}

/** Reject strings that are only whitespace (after optional trim check elsewhere). */
export function notWhitespaceOnly(message = 'Cannot be only spaces.'): StringValidator {
  return (value) => {
    if (value.length > 0 && value.trim() === '') return message
    return null
  }
}

export function minLength(min: number, message?: string): StringValidator {
  const msg = message ?? `Must be at least ${min} characters.`
  return (value) => {
    if (value.trim().length < min) return msg
    return null
  }
}

export function maxLength(max: number, message?: string): StringValidator {
  const msg = message ?? `Must be at most ${max} characters.`
  return (value) => {
    if (value.length > max) return msg
    return null
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function email(message = 'Enter a valid email address.'): StringValidator {
  return (value) => {
    const v = value.trim()
    if (v === '') return null
    if (!EMAIL_RE.test(v)) return message
    return null
  }
}

/** Practical international-style phone: optional +, digits and common separators, then digit count. */
const PHONE_DIGITS_RE = /\D/g

export function phone(
  opts: { minDigits?: number, maxDigits?: number, message?: string } = {},
): StringValidator {
  const minD = opts.minDigits ?? 10
  const maxD = opts.maxDigits ?? 15
  const message = opts.message ?? 'Enter a valid phone number.'
  return (value) => {
    const v = value.trim()
    if (v === '') return null
    const digits = v.replace(PHONE_DIGITS_RE, '').length
    if (digits < minD || digits > maxD) return message
    return null
  }
}

export function isoDate(message = 'Choose a valid date.'): StringValidator {
  return (value) => {
    const v = value.trim()
    if (v === '') return message
    if (!parseIsoDate(v)) return message
    return null
  }
}

export function optionalIsoDate(message = 'Choose a valid date.'): StringValidator {
  return (value) => {
    const v = value.trim()
    if (v === '') return null
    if (!parseIsoDate(v)) return message
    return null
  }
}

/** End date must be on or after start (both ISO yyyy-mm-dd). */
export function endOnOrAfterStart(
  startIso: string,
  message = 'End date must be on or after the start date.',
): StringValidator {
  return (endIso) => {
    const end = parseIsoDate(endIso.trim())
    const start = parseIsoDate(startIso.trim())
    if (!end || !start) return null
    if (dateOnlyCompare(end, start) < 0) return message
    return null
  }
}

/** Only ASCII digits, length inclusive. */
export function digitsOnlyInRange(
  minLen: number,
  maxLen: number,
  message = 'Use digits only.',
): StringValidator {
  return (value) => {
    const v = value.trim()
    if (!/^\d+$/.test(v)) return message
    if (v.length < minLen || v.length > maxLen)
      return `Must be between ${minLen} and ${maxLen} digits.`
    return null
  }
}

/** Value must be one of the allowed strings (after trim). */
export function oneOf(allowed: readonly string[], message = 'Select a valid option.'): StringValidator {
  return (value) => {
    const v = value.trim()
    if (!allowed.includes(v)) return message
    return null
  }
}

/** Discord snowflake–style: numeric string, typical 17–20 digits. */
export function discordSnowflakeId(
  message = 'Enter a valid bot ID (numeric, 17–20 digits).',
): StringValidator {
  return (value) => {
    const v = value.trim()
    if (!/^\d{17,20}$/.test(v)) return message
    return null
  }
}

export function minTrimmedLength(min: number, message?: string): StringValidator {
  const msg = message ?? `Must be at least ${min} non-space characters.`
  return (value) => {
    if (value.trim().length < min) return msg
    return null
  }
}

export function passwordRules(opts: {
  minLength?: number
  maxLength?: number
} = {}): StringValidator {
  const min = opts.minLength ?? 8
  const max = opts.maxLength ?? 128
  return (value) => {
    const v = value
    if (v.length < min) return `Password must be at least ${min} characters.`
    if (v.length > max) return `Password must be at most ${max} characters.`
    if (v.trim() !== v) return 'Password cannot start or end with spaces.'
    return null
  }
}

/** Run validators in order; return first error or null. */
export function firstError(value: string, rules: StringValidator[]): string | null {
  for (const rule of rules) {
    const err = rule(value)
    if (err) return err
  }
  return null
}

export interface DiscordBotFormShape {
  server: string
  botId: string
  token: string
}

export function discordBotFieldErrors(data: DiscordBotFormShape): Record<keyof DiscordBotFormShape, string> {
  return {
    server: firstError(data.server, [
      trimmedRequired(),
      oneOf(AVAILABLE_SERVERS, 'Please select a server from the list.'),
    ]) ?? '',
    botId: firstError(data.botId, [trimmedRequired(), discordSnowflakeId()]) ?? '',
    token: firstError(data.token, [
      trimmedRequired(),
      notWhitespaceOnly(),
      minTrimmedLength(20),
      maxLength(512),
    ]) ?? '',
  }
}

/** Matches TimePicker 12h / 24h model strings. */
export function timePickerValue(
  hour12 = true,
  message = 'Select a time.',
): StringValidator {
  return (value) => {
    const v = value.trim()
    if (!v) return message
    if (hour12) {
      const match = v.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
      if (!match?.[1] || !match[2] || !match[3]) return 'Select a valid time.'
      const h = Number.parseInt(match[1], 10)
      const mi = Number.parseInt(match[2], 10)
      if (h < 1 || h > 12 || mi < 0 || mi > 59) return 'Select a valid time.'
      return null
    }
    const m24 = v.match(/^(\d{1,2}):(\d{2})$/)
    if (!m24?.[1] || !m24[2]) return 'Select a valid time.'
    const h = Number.parseInt(m24[1], 10)
    const mi = Number.parseInt(m24[2], 10)
    if (h < 0 || h > 23 || mi < 0 || mi > 59) return 'Select a valid time.'
    return null
  }
}

/** Image MIME types commonly chosen with accept="image/*". */
const IMAGE_MIME_PREFIX = 'image/'

export function imageFileSelected(maxBytes: number): (file: File | null | undefined) => string | null {
  return (file) => {
    if (!file) return null
    if (!file.type.startsWith(IMAGE_MIME_PREFIX))
      return 'Please choose an image file (PNG, JPEG, WebP, etc.).'
    if (file.size > maxBytes)
      return `Image must be ${Math.round(maxBytes / (1024 * 1024))} MB or smaller.`
    return null
  }
}
