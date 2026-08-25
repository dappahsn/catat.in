export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  account_id: string
  destination_account_id: string | null
  category_id: string | null
  amount: number
  transaction_date: string // DATE format 'YYYY-MM-DD'
  notes: string | null
  created_at: string
  updated_at: string
  // Joined fields (from query)
  accounts?: { name: string; type: string; icon: string | null } | null
  destination_accounts?: { name: string; type: string } | null
  categories?: { name: string; icon: string | null } | null
}

export interface TransactionFilter {
  startDate: string
  endDate: string
}

export type DatePreset = 'today' | 'yesterday' | '7days' | 'thisMonth' | 'custom'

export interface CreateTransactionInput {
  type: TransactionType
  account_id: string
  destination_account_id?: string | null
  category_id?: string | null
  amount: number
  transaction_date: string
  notes?: string | null
}
