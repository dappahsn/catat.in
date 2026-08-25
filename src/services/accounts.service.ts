import { supabase } from '@/lib/supabase'
import type { Account } from '@/types/account'

/**
 * Get all accounts for the current user with computed current balance.
 */
export async function getAccounts(userId: string): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('id, user_id, name, type, icon, initial_balance, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

/**
 * Compute the current balance for a single account.
 * Balance = initial_balance + income - expense + incoming_transfer - outgoing_transfer
 */
export async function getAccountBalance(accountId: string): Promise<number> {
  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount, destination_account_id')
    .eq('account_id', accountId)

  if (error) throw error

  // Also fetch incoming transfers
  const { data: incoming, error: inErr } = await supabase
    .from('transactions')
    .select('amount')
    .eq('destination_account_id', accountId)
    .eq('type', 'transfer')

  if (inErr) throw inErr

  // Fetch initial balance
  const { data: account, error: accErr } = await supabase
    .from('accounts')
    .select('initial_balance')
    .eq('id', accountId)
    .single()

  if (accErr) throw accErr

  let balance = Number(account.initial_balance)

  for (const t of data ?? []) {
    if (t.type === 'income') balance += Number(t.amount)
    else if (t.type === 'expense') balance -= Number(t.amount)
    else if (t.type === 'transfer') balance -= Number(t.amount) // outgoing
  }

  for (const t of incoming ?? []) {
    balance += Number(t.amount)
  }

  return balance
}

/**
 * Get account balances for all accounts in a batch.
 */
export async function getAccountsWithBalances(userId: string) {
  const accounts = await getAccounts(userId)

  // Get all transactions for this user
  const { data: txs, error } = await supabase
    .from('transactions')
    .select('type, amount, account_id, destination_account_id')
    .eq('user_id', userId)

  if (error) throw error

  return accounts.map((acc) => {
    let balance = Number(acc.initial_balance)

    for (const t of txs ?? []) {
      if (t.account_id === acc.id) {
        if (t.type === 'income') balance += Number(t.amount)
        else if (t.type === 'expense') balance -= Number(t.amount)
        else if (t.type === 'transfer') balance -= Number(t.amount)
      }
      if (t.type === 'transfer' && t.destination_account_id === acc.id) {
        balance += Number(t.amount)
      }
    }

    return { ...acc, current_balance: balance }
  })
}

/**
 * Get monthly income and expense for an account (current month).
 */
export async function getAccountMonthlyStats(accountId: string, year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0)
  const endStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('account_id', accountId)
    .in('type', ['income', 'expense'])
    .gte('transaction_date', startDate)
    .lte('transaction_date', endStr)

  if (error) throw error

  let monthlyIncome = 0
  let monthlyExpense = 0

  for (const t of data ?? []) {
    if (t.type === 'income') monthlyIncome += Number(t.amount)
    else monthlyExpense += Number(t.amount)
  }

  return { monthlyIncome, monthlyExpense }
}

/**
 * Create a new account.
 */
export async function createAccount(
  userId: string,
  data: { name: string; type: string; icon?: string | null; initial_balance: number }
): Promise<Account> {
  const { data: result, error } = await supabase
    .from('accounts')
    .insert({ user_id: userId, ...data })
    .select()
    .single()

  if (error) throw error
  return result
}

/**
 * Update an account (name, type, icon only — balance is derived).
 */
export async function updateAccount(
  accountId: string,
  data: { name?: string; type?: string; icon?: string | null }
): Promise<Account> {
  const { data: result, error } = await supabase
    .from('accounts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', accountId)
    .select()
    .single()

  if (error) throw error
  return result
}

/**
 * Check if an account has any transactions.
 */
export async function accountHasTransactions(accountId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .or(`account_id.eq.${accountId},destination_account_id.eq.${accountId}`)

  if (error) throw error
  return (count ?? 0) > 0
}

/**
 * Delete an account (only if no transactions exist).
 */
export async function deleteAccount(accountId: string): Promise<void> {
  const hasTransactions = await accountHasTransactions(accountId)
  if (hasTransactions) {
    throw new Error('ACCOUNT_HAS_TRANSACTIONS')
  }
  const { error } = await supabase.from('accounts').delete().eq('id', accountId)
  if (error) throw error
}
