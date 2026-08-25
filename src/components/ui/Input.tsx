import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
  hint?: string
  prefix?: string
}

export function Input({ label, error, hint, prefix, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-[var(--text-secondary)] select-none pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          className={[
            'w-full rounded-[10px] border text-sm bg-[var(--surface)] text-[var(--text-primary)]',
            'px-3 py-2.5 min-h-11 transition-fast',
            'placeholder:text-[var(--text-muted)]',
            'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]',
            error
              ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-light)]'
              : 'border-[var(--border)]',
            prefix ? 'pl-9' : '',
            className,
          ].join(' ')}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--danger)]">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--text-muted)]">
          {hint}
        </p>
      )}
    </div>
  )
}
