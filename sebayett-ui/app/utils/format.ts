/** "March 29, 2026, 5:22 PM" in the viewer's own time zone. */
export function formatDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

/** "April 26, 1967" for date-only values ("1967-04-26"); read as UTC so it never shifts a day. */
export function formatDateOnly(value: string | null | undefined): string {
  if (!value) return ''
  return new Date(`${value.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

/** "pending" -> "Pending" */
export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
