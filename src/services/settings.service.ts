import { supabase } from '@/lib/supabase'
import type { UserSettings, Reminder } from '@/types/settings'

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateUserSettings(
  userId: string,
  updates: Partial<Pick<UserSettings, 'language' | 'theme' | 'accent_color' | 'currency'>>
): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getReminder(userId: string): Promise<Reminder | null> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateReminder(
  userId: string,
  updates: { enabled: boolean; time?: string | null }
): Promise<Reminder> {
  const { data, error } = await supabase
    .from('reminders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
