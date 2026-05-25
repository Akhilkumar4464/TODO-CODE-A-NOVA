import React, { useEffect, useState } from 'react'

export default function Toast({ message, type = 'info', onClose, duration = 2500 }) {
  const [open, setOpen] = useState(Boolean(message))

  useEffect(() => {
    if (!message) return
    setOpen(true)
    const t = setTimeout(() => {
      setOpen(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(t)
  }, [message, duration, onClose])

  if (!open || !message) return null

  const colors =
    type === 'success'
      ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
      : type === 'error'
        ? 'border-rose-400/20 bg-rose-500/10 text-rose-100'
        : 'border-white/15 bg-white/5 text-white/90'

  return (
    <div className="fixed right-4 top-4 z-[60] max-w-[420px]">
      <div className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${colors}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-semibold">{message}</div>
          <button
            className="rounded-xl px-2 py-1 text-xs font-bold text-white/70 hover:bg-white/10"
            onClick={() => {
              setOpen(false)
              onClose?.()
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

