/**
 * Format a numeric amount to IDR currency string.
 * Store numeric values, display formatted strings.
 */
export function formatCurrency(
  amount: number,
  locale: string = 'id-ID',
  currency: string = 'IDR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format to compact notation for summary cards (e.g. Rp 12,5 jt)
 */
export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1).replace('.', ',')} M`
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1).replace('.', ',')} jt`
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)} rb`
  }
  return formatCurrency(amount)
}

/**
 * Parse a currency display string back to number (removes formatting).
 */
export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '')
  return parseInt(cleaned, 10) || 0
}

/**
 * Format number with thousand separator (for input display).
 */
export function formatNumberDisplay(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}
