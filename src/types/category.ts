export interface Category {
  id: string
  user_id: string | null
  name: string
  type: 'income' | 'expense'
  icon: string | null
  is_default: boolean
  created_at: string
}

export interface CreateCategoryInput {
  name: string
  type: 'income' | 'expense'
  icon?: string | null
}

export interface UpdateCategoryInput {
  name?: string
  type?: 'income' | 'expense'
  icon?: string | null
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Makanan', icon: '🍔' },
  { name: 'Transportasi', icon: '🚗' },
  { name: 'Belanja', icon: '🛍️' },
  { name: 'Tagihan', icon: '📄' },
  { name: 'Hiburan', icon: '🎬' },
  { name: 'Kesehatan', icon: '🏥' },
  { name: 'Pendidikan', icon: '📚' },
  { name: 'Lainnya', icon: '📦' },
] as const

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Gaji', icon: '💰' },
  { name: 'Freelance', icon: '💻' },
  { name: 'Bonus', icon: '🎁' },
  { name: 'Hadiah', icon: '🎀' },
  { name: 'Investasi', icon: '📈' },
  { name: 'Lainnya', icon: '📦' },
] as const
