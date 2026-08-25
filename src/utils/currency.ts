/**
 * Format a numeric amount to IDR currency string.
 * Store numeric values, display formatted strings.
 */
export function formatCurrency(
  amount: number,
  locale: string = 'id-ID',
  currency: string = 'IDR'
): string {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  // Replace any spaces with non-breaking spaces so currency symbols & minus signs never wrap onto a separate line
  return formatted.replace(/\s+/g, '\u00A0')
}

/**
 * Format to compact notation for summary cards (e.g. Rp 12,5 jt)
 */
export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `Rp\u00A0${(amount / 1_000_000_000).toFixed(1).replace('.', ',')}\u00A0M`
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp\u00A0${(amount / 1_000_000).toFixed(1).replace('.', ',')}\u00A0jt`
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp\u00A0${(amount / 1_000).toFixed(0)}\u00A0rb`
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
