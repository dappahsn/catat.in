import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ThemeMode, AccentColor } from '@/types/settings'

interface ThemeContextValue {
  theme: ThemeMode
  accentColor: AccentColor
  setTheme: (theme: ThemeMode) => void
  setAccentColor: (color: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function applyAccent(color: AccentColor) {
  document.documentElement.setAttribute('data-accent', color)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('catatin_theme')
    return (saved === 'dark' || saved === 'light') ? saved : 'light'
  })
  const [accentColor, setAccentColorState] = useState<AccentColor>('green')

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('catatin_theme', theme)
  }, [theme])

  useEffect(() => {
    applyAccent(accentColor)
  }, [accentColor])

  const setTheme = (t: ThemeMode) => {
    const targetTheme = t === 'dark' ? 'dark' : 'light'
    setThemeState(targetTheme)
    applyTheme(targetTheme)
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
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
