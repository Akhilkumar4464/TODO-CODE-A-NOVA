import React, { useEffect } from 'react'
import Card from './Card'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onClose?.()}
      />

      <Card className="relative w-full max-w-lg p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-extrabold text-white">{title}</h2>
          <button
            onClick={() => onClose?.()}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-1 text-sm font-semibold text-white/80 hover:bg-white/10"
            aria-label="close"
          >
            ✕
          </button>
        </div>
        {children}
      </Card>
    </div>
  )
}

