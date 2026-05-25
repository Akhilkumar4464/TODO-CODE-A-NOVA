import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-extrabold text-white">Code-A-Nova</div>
            <div className="text-xs text-white/55">
              Secure OTP auth • Task CRUD • Reminders
            </div>
          </div>
          <div className="text-xs text-white/55">
            Contact: <a className="font-semibold text-white/80 hover:text-white" href="mailto:codenova31@gmail.com">codenova31@gmail.com</a>
          </div>
        </div>
        <div className="mt-4 text-[11px] text-white/45">© {new Date().getFullYear()} Code-A-Nova. All rights reserved.</div>
      </div>
    </footer>
  )
}

