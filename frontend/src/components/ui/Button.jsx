import React from 'react'

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-white/10 text-white hover:bg-white/15 focus:ring-white/30 border border-white/15',
    secondary:
      'bg-white/90 text-slate-900 hover:bg-white border border-white/60 focus:ring-slate-300',
    danger: 'bg-rose-500/90 text-white hover:bg-rose-500 focus:ring-rose-200',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
      {...props}
    />
  )
}

