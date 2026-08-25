import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ThemeMode, AccentColor } from '@/types/settings'

interface ThemeContextValue {
  theme: ThemeMode
  accentColor: AccentColor
  setTheme: (theme: ThemeMode) => void
  setAccentColor: (color: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  const resolved = theme === 'system' ? getSystemTheme() : theme
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function applyAccent(color: AccentColor) {
  document.documentElement.setAttribute('data-accent', color)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system')
  const [accentColor, setAccentColorState] = useState<AccentColor>('blue')

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    applyAccent(accentColor)
  }, [accentColor])

  // Listen for system theme change
  useEffect(() => {
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (t: ThemeMode) => {
    setThemeState(t)
    applyTheme(t)
  }

  const setAccentColor = (c: AccentColor) => {
    setAccentColorState(c)
    applyAccent(c)
  }

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
