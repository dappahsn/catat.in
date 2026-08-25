import { supabase } from '@/lib/supabase'
import type { BackupData, BackupPreview } from '@/types/backup'
import { BACKUP_APP_ID, BACKUP_VERSION } from '@/lib/constants'
import { validateBackupJson } from '@/utils/validation'

/**
 * Create a JSON backup of all user data and trigger download.
 * Excludes any authentication tokens or secrets.
 */
export async function createBackup(userId: string): Promise<void> {
  const [accountsRes, transactionsRes, categoriesRes, settingsRes, remindersRes] = await Promise.all([
    supabase.from('accounts').select('id, name, type, icon, initial_balance, created_at, updated_at').eq('user_id', userId),
    supabase.from('transactions').select('id, type, account_id, destination_account_id, category_id, amount, transaction_date, notes, created_at, updated_at').eq('user_id', userId),
    supabase.from('categories').select('id, name, type, icon, is_default, created_at').eq('user_id', userId),
    supabase.from('user_settings').select('language, theme, accent_color, currency, created_at, updated_at').eq('user_id', userId).maybeSingle(),
    supabase.from('reminders').select('enabled, time, created_at, updated_at').eq('user_id', userId).maybeSingle(),
  ])

  if (accountsRes.error) throw accountsRes.error
  if (transactionsRes.error) throw transactionsRes.error
  if (categoriesRes.error) throw categoriesRes.error

  const backup: BackupData = {
    metadata: {
      version: BACKUP_VERSION,
      created_at: new Date().toISOString(),
      app: BACKUP_APP_ID,
    },
    accounts: accountsRes.data ?? [],
    transactions: transactionsRes.data ?? [],
    categories: categoriesRes.data ?? [],
    settings: settingsRes.data ?? null,
    reminders: remindersRes.data ?? null,
  }

  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const dateStr = new Date().toISOString().split('T')[0]
  link.href = url
  link.download = `finance-backup-${dateStr}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Validate and preview a backup file before restoring.
 */
export function previewBackup(json: unknown): { preview: BackupPreview | null; error?: string } {
  const { valid, error } = validateBackupJson(json)
  if (!valid) return { preview: null, error }

  const data = json as BackupData
  return {
    preview: {
      accountCount: data.accounts.length,
      transactionCount: data.transactions.length,
      categoryCount: data.categories.length,
      createdAt: data.metadata.created_at,
      version: data.metadata.version,
    },
  }
}

/**
 * Restore data from a backup. Uses current user_id for all records.
 * Does NOT trust user_id from the backup file.
 */
export async function restoreBackup(userId: string, json: BackupData): Promise<void> {
  // Build ID mapping from old IDs → new UUIDs
  const accountIdMap = new Map<string, string>()
  const categoryIdMap = new Map<string, string>()

  // 1. Insert categories first
  for (const cat of json.categories) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        is_default: cat.is_default,
      })
      .select('id')
      .single()
    if (error) throw error
    categoryIdMap.set(cat.id, data.id)
  }

  // 2. Insert accounts
  for (const acc of json.accounts) {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: userId,
        name: acc.name,
        type: acc.type,
        icon: acc.icon,
        initial_balance: acc.initial_balance,
      })
      .select('id')
      .single()
    if (error) throw error
    accountIdMap.set(acc.id, data.id)
  }

  // 3. Insert transactions with remapped IDs
  const txBatch = json.transactions.map((t) => ({
    user_id: userId,
    type: t.type,
    account_id: accountIdMap.get(t.account_id) ?? t.account_id,
    destination_account_id: t.destination_account_id
      ? (accountIdMap.get(t.destination_account_id) ?? t.destination_account_id)
      : null,
    category_id: t.category_id
      ? (categoryIdMap.get(t.category_id) ?? t.category_id)
      : null,
    amount: t.amount,
    transaction_date: t.transaction_date,
    notes: t.notes,
  }))

  if (txBatch.length > 0) {
    const { error } = await supabase.from('transactions').insert(txBatch)
    if (error) throw error
  }
}

/**
 * Delete all financial data for the current user.
 * Does NOT delete the Supabase auth user or Google account.
 */
export async function deleteAllData(userId: string): Promise<void> {
  // Order matters for FK constraints
  await supabase.from('transactions').delete().eq('user_id', userId)
  await supabase.from('accounts').delete().eq('user_id', userId)
  // Delete custom categories (non-default), then re-create defaults
  await supabase.from('categories').delete().eq('user_id', userId)
}
