import React, { useContext } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { AuthContext } from '../../context/AuthContext'

export default function PageShell({ children }) {
  const { user, logout } = useContext(AuthContext)
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(800px_circle_at_90%_30%,rgba(168,85,247,0.16),transparent_45%),radial-gradient(900px_circle_at_40%_110%,rgba(34,197,94,0.12),transparent_50%)] flex flex-col justify-between">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow animate-fadeUp">{children}</main>
      <Footer />
    </div>
  )
}

