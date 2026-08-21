/**
 * Design token: Color system
 * Light and dark theme color palettes derived from DESIGN.md.
 */

export const LightColors = {
  // Backgrounds
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F2F5',

  // Text
  textPrimary: '#171A1F',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Border
  border: '#E5E7EB',

  // Primary (blue)
  primary: '#2F80ED',
  primaryHover: '#256FD1',
  primarySoft: '#EAF3FF',

  // Income (green)
  income: '#14B87A',
  incomeSoft: '#E7F8F1',

  // Expense (red)
  expense: '#EF5B5B',
  expenseSoft: '#FDECEC',

  // Transfer (purple)
  transfer: '#7C6FF2',
  transferSoft: '#F0EEFF',

  // Warning (orange)
  warning: '#F4A340',
  warningSoft: '#FFF3DF',

  // Danger
  danger: '#E5484D',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Card shadow
  shadow: 'rgba(0, 0, 0, 0.06)',
} as const;

export const DarkColors = {
  // Backgrounds
  background: '#0E1116',
  surface: '#151A21',
  surfaceSecondary: '#1D232C',

  // Text
  textPrimary: '#F7F8FA',
  textSecondary: '#A7B0BE',
  textTertiary: '#747E8D',

  // Border
  border: '#2A323D',

  // Primary (blue)
  primary: '#5BA2FF',
  primaryHover: '#4D8FE0',
  primarySoft: '#152B47',

  // Income (green)
  income: '#48D5A1',
  incomeSoft: '#123B31',

  // Expense (red)
  expense: '#FF7777',
  expenseSoft: '#442222',

  // Transfer (purple)
  transfer: '#9C91FF',
  transferSoft: '#2C2750',

  // Warning (orange)
  warning: '#FFC267',
  warningSoft: '#4A3515',

  // Danger
  danger: '#FF5C5C',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Card shadow
  shadow: 'rgba(0, 0, 0, 0.3)',
} as const;

export type ColorKey = keyof typeof LightColors;
export type Colors = typeof LightColors;
