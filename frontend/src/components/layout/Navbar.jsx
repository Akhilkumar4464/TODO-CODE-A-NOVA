import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../ui/Container'
import Button from '../ui/Button'

function getInitialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return 'dark'
}

export default function Navbar({ user, onLogout }) {
  const [theme, setTheme] = useState(getInitialTheme())
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleLogout = () => {
    onLogout?.()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <span className="text-sm font-extrabold tracking-tight text-white">CA</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-white">Code-A-Nova</div>
              <div className="text-xs text-white/55">Premium TODO dashboard</div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 md:flex">
            <Link className="text-sm font-semibold text-white/70 hover:text-white" to="/">
              Home
            </Link>
            <Link className="text-sm font-semibold text-white/70 hover:text-white" to="/dashboard">
              Dashboard
            </Link>
            <a
              className="text-sm font-semibold text-white/70 hover:text-white"
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                navigate('/contact')
              }}
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="hidden rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white/80 hover:bg-white/10 md:inline-flex"
              aria-label="toggle theme"
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>

            {user ? (
              <>
                <div className="hidden items-center gap-3 md:flex">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-white/90">{user.UserName}</div>
                    <div className="text-[11px] text-white/55">{user.gmail}</div>
                  </div>
                </div>
                <Button variant="secondary" onClick={handleLogout} className="h-11">
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button size="md" variant="primary">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="md" variant="secondary">
                    Signup
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}

