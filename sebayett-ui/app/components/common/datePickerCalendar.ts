/** Calendar helpers for Sebayett datepicker (ISO yyyy-mm-dd, display DD-MM-YYYY). */

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function parseIsoDate(s: string): Date | null {
  if (!s) return null
  const parts = s.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null
  const [y, m, d] = parts
  const dt = new Date(y, m - 1, d)
  if (
    dt.getFullYear() !== y
    || dt.getMonth() !== m - 1
    || dt.getDate() !== d
  ) {
    return null
  }
  return dt
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDisplayDdMmYyyy(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const y = d.getFullYear()
  return `${dd}-${mm}-${y}`
}

export function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
  )
}

export interface CalendarCell {
  date: Date
  inCurrentMonth: boolean
}

export function buildMonthGrid(viewYear: number, viewMonth: number): CalendarCell[] {
  const first = new Date(viewYear, viewMonth, 1)
  const startDow = first.getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate()
  const cells: CalendarCell[] = []

  for (let i = 0; i < startDow; i++) {
    const day = daysInPrev - startDow + 1 + i
    cells.push({
      date: new Date(viewYear, viewMonth - 1, day),
      inCurrentMonth: false,
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: new Date(viewYear, viewMonth, d),
      inCurrentMonth: true,
    })
  }

  const filled = startDow + daysInMonth
  const remaining = Math.ceil(filled / 7) * 7 - filled
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      date: new Date(viewYear, viewMonth + 1, i),
      inCurrentMonth: false,
    })
  }

  return cells
}

export function dateOnlyCompare(a: Date, b: Date): number {
  const ta = a.getFullYear() * 10000 + (a.getMonth() + 1) * 100 + a.getDate()
  const tb = b.getFullYear() * 10000 + (b.getMonth() + 1) * 100 + b.getDate()
  return ta - tb
}

export function isDateDisabled(
  d: Date,
  minIso?: string,
  maxIso?: string,
): boolean {
  const minD = minIso ? parseIsoDate(minIso) : null
  const maxD = maxIso ? parseIsoDate(maxIso) : null
  if (minD && dateOnlyCompare(d, minD) < 0) return true
  if (maxD && dateOnlyCompare(d, maxD) > 0) return true
  return false
}
