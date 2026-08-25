import React, { createContext, useContext, useState, useCallback } from 'react'
import type { TranslationKey } from '@/locales/id'
import { id } from '@/locales/id'
import { en } from '@/locales/en'
import type { Language } from '@/types/settings'

type Translations = Record<TranslationKey, string>

interface I18nContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const translations: Record<Language, Translations> = { id, en }

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id')

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] ?? key
  }, [language])

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
