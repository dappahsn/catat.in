/**
 * Validate an amount value: must be a positive number.
 */
export function validateAmount(value: number): string | null {
  if (!value || isNaN(value)) return 'Jumlah wajib diisi'
  if (value <= 0) return 'Jumlah harus lebih dari 0'
  return null
}

/**
 * Validate account name.
 */
export function validateAccountName(name: string): string | null {
  if (!name || name.trim().length === 0) return 'Nama rekening wajib diisi'
  if (name.trim().length > 50) return 'Nama rekening maksimal 50 karakter'
  return null
}

/**
 * Validate category name.
 */
export function validateCategoryName(name: string): string | null {
  if (!name || name.trim().length === 0) return 'Nama kategori wajib diisi'
  if (name.trim().length > 50) return 'Nama kategori maksimal 50 karakter'
  return null
}


/**
 * Validate that source and destination accounts differ.
 */
export function validateTransferAccounts(sourceId: string, destId: string): string | null {
  if (!sourceId) return 'Rekening asal wajib dipilih'
  if (!destId) return 'Rekening tujuan wajib dipilih'
  if (sourceId === destId) return 'Rekening asal dan tujuan tidak boleh sama'
  return null
}

/**
 * Validate transfer amount does not exceed source balance.
 */
export function validateTransferAmount(amount: number, sourceBalance: number): string | null {
  const amtErr = validateAmount(amount)
  if (amtErr) return amtErr
  if (amount > sourceBalance) return 'Saldo rekening asal tidak mencukupi'
  return null
}

/**
 * Validate expense amount does not exceed account balance.
 */
export function validateExpenseAmount(amount: number, accountBalance: number): string | null {
  const amtErr = validateAmount(amount)
  if (amtErr) return amtErr
  if (amount > accountBalance) return 'Saldo rekening tidak mencukupi'
  return null
}

/**
 * Validate backup JSON has required structure.
 */
export function validateBackupJson(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Format backup tidak valid' }
  const d = data as Record<string, unknown>
  if (!d.metadata || typeof d.metadata !== 'object') return { valid: false, error: 'Metadata backup tidak ditemukan' }
  const meta = d.metadata as Record<string, unknown>
  if (meta.app !== 'catat-in-app' && meta.app !== 'finance-web-app') return { valid: false, error: 'File backup tidak dikenali' }
  if (typeof meta.version !== 'number') return { valid: false, error: 'Versi backup tidak valid' }
  if (!Array.isArray(d.accounts)) return { valid: false, error: 'Data rekening tidak valid' }
  if (!Array.isArray(d.transactions)) return { valid: false, error: 'Data transaksi tidak valid' }
  if (!Array.isArray(d.categories)) return { valid: false, error: 'Data kategori tidak valid' }
  return { valid: true }
}
