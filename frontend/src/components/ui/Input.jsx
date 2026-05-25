import React from 'react'

export default function Input({
  className = '',
  label,
  error,
  hint,
  ...props
}) {
  return (
    <div className={`grid gap-2 ${className}`.trim()}>
      {label ? (
        <label className="text-sm font-semibold text-white/90">{label}</label>
      ) : null}

      <input
        className={
          'h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-white placeholder:text-white/40 outline-none transition focus:border-white/30 focus:bg-white/8'
        }
        {...props}
      />

      {error ? (
        <p className="text-sm text-rose-200">{error}</p>
      ) : hint ? (
        <p className="text-sm text-white/55">{hint}</p>
      ) : null}
    </div>
  )
}

