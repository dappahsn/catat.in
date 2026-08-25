import { supabase } from '@/lib/supabase'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/category'

export async function getCategories(userId: string, type?: 'income' | 'expense'): Promise<Category[]> {
  let query = supabase
    .from('categories')
    .select('id, user_id, name, type, icon, is_default, created_at')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('name')

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createCategory(
  userId: string,
  data: CreateCategoryInput
): Promise<Category> {
  const { data: result, error } = await supabase
    .from('categories')
    .insert({ user_id: userId, ...data, is_default: false })
    .select()
    .single()

  if (error) throw error
  return result
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput
): Promise<Category> {
  const { data: result, error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return result
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

