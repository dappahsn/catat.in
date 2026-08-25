import { supabase } from '@/lib/supabase'
import type { TransactionFilter } from '@/types/transaction'

export interface RecapSummary {
  income: number
  expense: number
  difference: number
}

export interface CategoryBreakdownItem {
  categoryId: string
  categoryName: string
  categoryIcon: string | null
  amount: number
  percentage: number
}

/**
 * Get recap summary: total income, total expense, and difference.
 * Transfer is EXCLUDED from both income and expense.
 */
export async function getRecapSummary(
  userId: string,
  filter: TransactionFilter
): Promise<RecapSummary> {
  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('user_id', userId)
    .in('type', ['income', 'expense'])
    .gte('transaction_date', filter.startDate)
    .lte('transaction_date', filter.endDate)

  if (error) throw error

  let income = 0
  let expense = 0

  for (const t of data ?? []) {
    if (t.type === 'income') income += Number(t.amount)
    else if (t.type === 'expense') expense += Number(t.amount)
  }

  return { income, expense, difference: income - expense }
}

/**
 * Get category breakdown for a given type (income or expense).
 * Returns sorted by amount descending with percentage.
 */
export async function getCategoryBreakdown(
  userId: string,
  type: 'income' | 'expense',
  filter: TransactionFilter
): Promise<CategoryBreakdownItem[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      amount,
      category_id,
      categories:category_id ( name, icon )
    `)
    .eq('user_id', userId)
    .eq('type', type)
    .gte('transaction_date', filter.startDate)
    .lte('transaction_date', filter.endDate)
    .not('category_id', 'is', null)

  if (error) throw error

  // Aggregate by category
  const map = new Map<string, { name: string; icon: string | null; total: number }>()

  for (const t of data ?? []) {
    const catId = t.category_id as string
    const cat = t.categories as unknown as { name: string; icon: string | null } | null
    const existing = map.get(catId)
    if (existing) {
      existing.total += Number(t.amount)
    } else {
      map.set(catId, {
        name: cat?.name ?? 'Lainnya',
        icon: cat?.icon ?? null,
        total: Number(t.amount),
      })
    }
  }

  const total = Array.from(map.values()).reduce((sum, c) => sum + c.total, 0)

  return Array.from(map.entries())
    .map(([id, c]) => ({
      categoryId: id,
      categoryName: c.name,
      categoryIcon: c.icon,
      amount: c.total,
      percentage: total > 0 ? Math.round((c.total / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}
