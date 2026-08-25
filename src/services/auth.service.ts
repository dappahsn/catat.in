import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/category'

/**
 * Ensure user profile, default settings, and default categories exist.
 * Called once after Google OAuth sign-in.
 */
export async function ensureUserProfile(user: User): Promise<void> {
  const userId = user.id
  const meta = user.user_metadata

  // 1. Upsert profile
  await supabase.from('profiles').upsert({
    id: userId,
    full_name: meta.full_name ?? meta.name ?? '',
    email: user.email ?? '',
    avatar_url: meta.avatar_url ?? meta.picture ?? '',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id', ignoreDuplicates: false })

  // 2. Insert default user settings (only if not exists)
  const { data: existingSettings } = await supabase
    .from('user_settings')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existingSettings) {
    await supabase.from('user_settings').insert({
      user_id: userId,
      language: 'id',
      theme: 'system',
      accent_color: 'blue',
      currency: 'IDR',
    })
  }

  // 3. Insert default reminder row (only if not exists)
  const { data: existingReminder } = await supabase
    .from('reminders')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existingReminder) {
    await supabase.from('reminders').insert({
      user_id: userId,
      enabled: false,
      time: null,
    })
  }

  // 4. Create default categories (only if user has no categories yet)
  const { data: existingCats } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (!existingCats || existingCats.length === 0) {
    const expenseCats = DEFAULT_EXPENSE_CATEGORIES.map((c) => ({
      user_id: userId,
      name: c.name,
      type: 'expense' as const,
      icon: c.icon,
      is_default: true,
    }))
    const incomeCats = DEFAULT_INCOME_CATEGORIES.map((c) => ({
      user_id: userId,
      name: c.name,
      type: 'income' as const,
      icon: c.icon,
      is_default: true,
    }))
    await supabase.from('categories').insert([...expenseCats, ...incomeCats])
  }
}
