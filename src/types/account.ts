export type AccountType = 'bank' | 'cash' | 'ewallet' | 'other'

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  icon: string | null
  initial_balance: number
  created_at: string
  updated_at: string
}

export interface AccountWithBalance extends Account {
  current_balance: number
  monthly_income: number
  monthly_expense: number
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  bank: 'Bank',
  cash: 'Tunai',
  ewallet: 'E-Wallet',
  other: 'Lainnya',
}
