import type { Account } from './account'
import type { Transaction } from './transaction'
import type { Category } from './category'
import type { UserSettings, Reminder } from './settings'

export interface BackupMetadata {
  version: number
  created_at: string
  app: string
}

export interface BackupData {
  metadata: BackupMetadata
  accounts: Omit<Account, 'user_id'>[]
  transactions: Omit<Transaction, 'user_id' | 'accounts' | 'destination_accounts' | 'categories'>[]
  categories: Omit<Category, 'user_id'>[]
  settings: Omit<UserSettings, 'user_id' | 'id'> | null
  reminders: Omit<Reminder, 'user_id' | 'id'> | null
}

export interface BackupPreview {
  accountCount: number
  transactionCount: number
  categoryCount: number
  createdAt: string
  version: number
}
