import { supabase } from '@/lib/supabase'
import type { Transaction, CreateTransactionInput, TransactionFilter } from '@/types/transaction'
import { TRANSACTIONS_PER_PAGE } from '@/lib/constants'

const SELECT_FIELDS = `
  id, user_id, type, account_id, destination_account_id, category_id,
  amount, transaction_date, notes, created_at, updated_at,
  accounts:account_id ( name, type, icon ),
  destination_accounts:destination_account_id ( name, type ),
  categories:category_id ( name, icon )
`

/**
 * Get paginated transactions for a user, filtered by date range.
 * RLS ensures only the user's own data is returned.
 */
export async function getTransactions(
  userId: string,
  filter: TransactionFilter,
  page: number = 0
): Promise<{ data: Transaction[]; hasMore: boolean }> {
  const from = page * TRANSACTIONS_PER_PAGE
  const to = from + TRANSACTIONS_PER_PAGE - 1

  const { data, error, count } = await supabase
    .from('transactions')
    .select(SELECT_FIELDS, { count: 'exact' })
    .eq('user_id', userId)
    .gte('transaction_date', filter.startDate)
    .lte('transaction_date', filter.endDate)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as Transaction[],
    hasMore: (count ?? 0) > to + 1,
  }
}

/**
 * Get all transactions in a date range (for export/recap — no pagination).
 */
export async function getAllTransactionsInRange(
  userId: string,
  filter: TransactionFilter
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select(SELECT_FIELDS)
    .eq('user_id', userId)
    .gte('transaction_date', filter.startDate)
    .lte('transaction_date', filter.endDate)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as Transaction[]
}

/**
 * Get transactions for a specific account.
 */
export async function getAccountTransactions(
  accountId: string,
  page: number = 0
): Promise<{ data: Transaction[]; hasMore: boolean }> {
  const from = page * TRANSACTIONS_PER_PAGE
  const to = from + TRANSACTIONS_PER_PAGE - 1

  const { data, error, count } = await supabase
    .from('transactions')
    .select(SELECT_FIELDS, { count: 'exact' })
    .or(`account_id.eq.${accountId},destination_account_id.eq.${accountId}`)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as Transaction[],
    hasMore: (count ?? 0) > to + 1,
  }
}

/**
 * Get a single transaction by ID.
 */
export async function getTransactionById(id: string): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data as unknown as Transaction | null
}

/**
 * Create a new transaction.
 */
export async function createTransaction(
  userId: string,
  input: CreateTransactionInput
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ user_id: userId, ...input })
    .select(SELECT_FIELDS)
    .single()

  if (error) throw error
  return data as unknown as Transaction
}

/**
 * Update an existing transaction.
 */
export async function updateTransaction(
  id: string,
  input: Partial<CreateTransactionInput>
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw error
  return data as unknown as Transaction
}

/**
 * Delete a transaction.
 */
export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}
