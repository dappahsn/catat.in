/**
 * Get today's date as 'YYYY-MM-DD' string.
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get yesterday's date as 'YYYY-MM-DD' string.
 */
export function getYesterdayString(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

/**
 * Get start of current month as 'YYYY-MM-DD'.
 */
export function getMonthStartString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
}

/**
 * Get end of current month as 'YYYY-MM-DD'.
 */
export function getMonthEndString(date = new Date()): string {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return formatDateToISO(end)
}

/**
 * Get start of N days ago as 'YYYY-MM-DD'.
 */
export function getNDaysAgoString(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - (days - 1))
  return formatDateToISO(d)
}

/**
 * Format Date object to 'YYYY-MM-DD'.
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Format 'YYYY-MM-DD' to localized display string.
 * e.g. '2026-08-25' → '25 Agustus 2026' (id) or 'August 25, 2026' (en)
 */
export function formatDateDisplay(dateStr: string, locale: string = 'id-ID'): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Format 'YYYY-MM-DD' to short display.
 * e.g. '25 Agt 2026' (id) or 'Aug 25, 2026' (en)
 */
export function formatDateShort(dateStr: string, locale: string = 'id-ID'): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Check if a date string is today.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString()
}

/**
 * Check if a date string is yesterday.
 */
export function isYesterday(dateStr: string): boolean {
  return dateStr === getYesterdayString()
}

/**
 * Get month label for display.
 * e.g. { year: 2026, month: 7 } → 'Agustus 2026' (months are 0-indexed)
 */
export function getMonthLabel(year: number, month: number, locale: string = 'id-ID'): string {
  return new Date(year, month, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })
}

/**
 * Validate date string is not in the future.
 */
export function isNotFutureDate(dateStr: string): boolean {
  return dateStr <= getTodayString()
}
