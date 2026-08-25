export type ThemeMode = 'system' | 'light' | 'dark'
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'red'
export type Language = 'id' | 'en'

export interface UserSettings {
  id: string
  user_id: string
  language: Language
  theme: ThemeMode
  accent_color: AccentColor
  currency: string
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  user_id: string
  enabled: boolean
  time: string | null // 'HH:MM:SS' format from Postgres TIME
  created_at: string
  updated_at: string
}
