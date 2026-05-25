import React, { createContext, useEffect, useMemo, useState } from 'react'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const apiBase = import.meta.env.VITE_API_URL

  const fetchMe = async (bearerToken = token) => {
    if (!bearerToken) return null
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/auth/profile`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to fetch profile')
      setUser(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }
    fetchMe(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (gmail, password) => {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gmail, password }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || 'Login failed')

    localStorage.setItem('token', data.token)
    setToken(data.token)
    await fetchMe(data.token)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => {
    return {
      user,
      token,
      loading,
      fetchMe,
      login,
      logout,
    }
  }, [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

